from mqtt_connector import run_mqtt_subscriber, publish_mqtt
import threading
import json
import random
import time

mqtt_thread = threading.Thread(target=run_mqtt_subscriber)
mqtt_thread.start() 
while True:
    time.sleep(5)
    publish_mqtt(
        "microlab/agro/green_house/air_hum_ctrl", 
        json.dumps({"sensor_id":333,"cur_hum":random.randint(1, 100),"set_point":60,"ctrl_mode":0,"ctrl_out": 0})
    )

    time.sleep(5)
    publish_mqtt(
        "microlab/agro/green_house/temp_heat_ctrl", 
        json.dumps({"sensor_id":888,"cur_temp":random.randint(1, 100),"set_point":60,"ctrl_mode":0,"ctrl_out": 0})
    )

    time.sleep(5)
    publish_mqtt(
        "microlab/agro/green_house/soil_moist_ctrl", 
        json.dumps({"sensor_id":444,"cur_moist":random.randint(1, 100),"set_point":60,"ctrl_mode":0,"ctrl_out": 0})
    )

    time.sleep(5)
    publish_mqtt(
        "microlab/agro/green_house/light_ctrl", 
        json.dumps({"sensor_id":666,"cur_lum":random.randint(1, 100),"set_point":60,"ctrl_mode":0,"ctrl_out": 0})
    )

    time.sleep(5)
    publish_mqtt(
        "microlab/agro/green_house/air_press_ctrl", 
        json.dumps({"sensor_id":222,"cur_press":random.randint(1, 100),"set_point":60,"ctrl_mode":0,"ctrl_out": 0})
    )

# publish_mqtt(
#     "microlab/agro/green_house/air_press_ctrl/set", 
#     json.dumps({"cmd": "set_point", "value": "13.2"})
# )

# microlab/agro/green_house/temp_vent_ctrl/set
# microlab/agro/green_house/temp_heat_ctrl/set
# microlab/agro/green_house/air_hum_ctrl/set
# microlab/agro/green_house/soil_moist_ctrl/set
# microlab/agro/green_house/air_press_ctrl/set
# microlab/agro/green_house/light_ctrl/set

# "cur_hum": "humidity",
# "cur_temp": "temperature",
# "cur_press": "air_pressure",
# "cur_moist": "soil_moisture",
# "cur_lum": "light"