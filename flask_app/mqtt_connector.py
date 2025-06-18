from paho.mqtt import client as mqtt_client 
import mqtt_access
import random
import json
import time

from db import db
from models import (
    Sensor, SensorData, Parameter
)

# MQTT Broker details 
broker = mqtt_access.host
port = mqtt_access.port 
client_id = f'subscribe-{random.randint(0, 1000)}' 
username = mqtt_access.username
password = mqtt_access.password
 
def connect_mqtt(): 
    def on_connect(client, userdata, flags, rc): 
        if rc == 0: 
            print("Connected to MQTT Broker!") 
        else: 
            print(f"Failed to connect, return code {rc}\n")
 
    client = mqtt_client.Client(client_id) 
    client.username_pw_set(username, password) 
    client.tls_set(ca_certs='./IoT.crt')
    client.on_connect = on_connect 
    client.connect(broker, port) 
    return client 
client = connect_mqtt() 

 
def subscribe(client): 
    def on_message(client, userdata, msg): 
        """Receives data from MQTT."""

        # Get the data from the MQTT broker
        message = msg.payload.decode() 
        print(f"Received `{message}` from `{msg.topic}` topic") 
        data = json.loads(message)

        # Add the data into the db
        # Data from the MQTT is of the format: 
        # air_hum_ctrl = {"sensor_id":333,"cur_hum":0,"set_point":60,"ctrl_mode":0,"ctrl_out": 0}
        from app import app
        with app.app_context():
            if 'sensor_id' in data: 
                sensor = Sensor.query.filter_by(name=str(data["sensor_id"])).first()
                if sensor:
                    print(sensor)
                    if sensor.zone_id:
                        # If the sensor already exists in the table, and its "zone_id" is set,
                        # you save the received sensor data in "sensors_data" table
                        try:
                            data_val = float(list(data.values())[1])
                            sensor_data = SensorData(
                                gh_id=sensor.gh_id,
                                zone_id=sensor.zone_id,
                                sensor_id=sensor.id,
                                data=data_val,
                                parameter_id=sensor.parameter.id
                            )
                            db.session.add(sensor_data)
                            db.session.commit()
                        except:
                            pass
                else:
                    # Save the name/id of the sensor in the "sensors" table, 
                    # if it doesn't exist there
                    match_params = {
                        "cur_hum": "humidity",
                        "cur_temp": "temperature",
                        "cur_press": "air_pressure",
                        "cur_moist": "soil_moisture",
                        "cur_lum": "light"
                    }
                    for key in data.keys():
                        if key in match_params:
                            data_param = match_params[key]
                            parameter = Parameter.query.filter_by(name=data_param).first()
                            sensor = Sensor(
                                name=data["sensor_id"],
                                parameter_id=parameter.id,
                                mqtt_topic=msg.topic + "/set"
                            )
                            try:
                                db.session.add(sensor)
                                db.session.commit()
                            except:
                                print("Error sensor")
                            break


            # When in the front the sensor is going to be set to a zone
            # we are going to add its "zone_id" in the "sensors" table


    client.subscribe("microlab/agro/green_house/+")
    client.on_message = on_message


def publish_mqtt(topic, message):
    """Publish to the MQTT function."""

    result = client.publish(topic, message)
    status = result[0]
    if status == 0:
        print(f"Sent `{message}` to topic `{topic}`")
    else:
        print(f"Failed to send message to topic {topic}")
 

def run_mqtt_subscriber(): 
    client.loop_start() 
    subscribe(client) 