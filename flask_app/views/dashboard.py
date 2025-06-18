from flask import Blueprint, request, jsonify
from sqlalchemy.sql import func
import json

from models import (
    Condition, Plant, Zone, 
    SensorData, Parameter, Sensor,
    Greenhouse
)
from mqtt_connector import publish_mqtt
from db import db


dashboard = Blueprint('dashboard', __name__)


@dashboard.route('/create-zone', methods=['POST'])
def create_zone():
    if request.method == 'POST':
        gh_id = request.json.get("gh_id")
        name = request.json.get("name", "Zone")

        greenhouse = Greenhouse.query.filter_by(id=gh_id).first()
        if not greenhouse:
            return jsonify({"message": "No greenhouse with this id!"}), 404
                
        zone = Zone(
            gh_id=gh_id,
            name=name
        )
        db.session.add(zone)
        db.session.commit()
        return jsonify({"message": "Zone created successfully!"}), 200


@dashboard.route('/get-zones/<int:gh_id>', methods=['GET'])
def get_zone(gh_id):
    if request.method == 'GET':
        greenhouse = Greenhouse.query.filter_by(id=gh_id).first()
        if not greenhouse:
            return jsonify({"message": "No greenhouse with this id!"}), 404        
        
        zones = Zone.query.filter_by(gh_id=gh_id).all()
        if zones:
            zones_data = []
            for zone in zones:
                zone_dict = {}
                zone_dict["zone_id"] = zone.id
                zone_dict["name"] = zone.name

                if zone.plant_id: zone_dict["plant_name"] = zone.plant.name
                else: zone_dict["plant_name"] = None

                if zone.plantation_date:
                    zone_dict["plantation_date"] = zone.plantation_date.isoformat()
                else: zone_dict["plantation_date"] = None

                # Add the sensors data of the zone
                zone_dict["sensors"] = []
                for sensor in zone.sensors:
                    sensor_data = {}
                    sensor_data["sensor_id"] = sensor.id
                    sensor_data["name"] = sensor.name
                    sensor_data["parameter"] = sensor.parameter.name
                    zone_dict["sensors"].append(sensor_data)
                zones_data.append(zone_dict)
            
            return jsonify(zones_data), 200
        return jsonify({"message": "No zones!"}), 404


@dashboard.route('/get-zone-parameters-averages', methods=['GET'])
def get_zone_parameters_avgs():
    if request.method == 'GET':
        gh_id = request.args.get("gh_id")
        greenhouse = Greenhouse.query.filter_by(id=gh_id).first()
        if not greenhouse:
            return jsonify({"message": "No greenhouse with this id!"}), 404        
        
        zone_id = request.args.get("zone_id")
        zone = Zone.query.filter_by(id=zone_id).first()
        if not zone:
            return jsonify({"message": "No zone with this id!"}), 404        
        
        # Add the averages of every parameter that exist for this zone and gh
        parameters_averages = db.session.query(
            Parameter.name, 
            func.avg(SensorData.data).label('average_data')
        ) \
        .join(SensorData, Parameter.id == SensorData.parameter_id) \
        .filter(SensorData.gh_id == gh_id) \
        .filter(SensorData.zone_id == zone_id) \
        .group_by(Parameter.name) \
        .all()

        # Consider the case when the zone has no data from sensors.
        if not parameters_averages:
            return jsonify({"message": "No data!"}), 404
        
        # Add the rows to dict.
        parameters_avgs_dict = {}
        for parameter, value in parameters_averages:
            parameters_avgs_dict[parameter] = value
        
        return jsonify(parameters_avgs_dict), 200
    

@dashboard.route('/get-free-sensors', methods=['GET'])
def get_sensors():
    if request.method == 'GET':
        # Send all the available sensors from "sensors" table
        # which were not yet chosen ("gh_id" and "zones_id" are null).
        sensors = Sensor.query.filter_by(gh_id=None, zone_id=None).all()
        if sensors:
            sensors_data = []
            for sensor in sensors:
                sensors_data.append({
                    "sensor_id": sensor.id,
                    "sensor_name": sensor.name,
                    "parameter": sensor.parameter.name
                })
            return jsonify(sensors_data), 200
        return jsonify({"message": "No sensors!"}), 404
    

@dashboard.route('/get-zone-sensors/<int:zone_id>', methods=['GET'])
def get_zone_sensors(zone_id):
    if request.method == 'GET':
        sensors = Sensor.query.filter_by(zone_id=zone_id).all()
        if sensors:
            sensors_data = []
            for sensor in sensors:
                sensors_data.append({
                    "sensor_id": sensor.id,
                    "sensor_name": sensor.name,
                    "parameter": sensor.parameter.name
                })
            return jsonify(sensors_data), 200
        return jsonify({"message": "No sensors!"}), 404


@dashboard.route('/set-sensor', methods=['PUT'])
def set_sensor():
    if request.method == 'PUT':
        # Get the sensor id, gh id and zone id to associate
        # the sensor to a specific zone
        ids = request.json
        sensor_id = ids.get("sensor_id")
        zone_id = ids.get("zone_id") 
        gh_id = ids.get("gh_id")

        sensor = Sensor.query.filter_by(id=sensor_id).first()
        if not sensor:
            return jsonify({"message": "No such sensor!"}), 404
        
        zone = Zone.query.filter_by(id=zone_id).first()
        if not zone:
            return jsonify({"message": "No such zone!"}), 404
        
        gh = Greenhouse.query.filter_by(id=gh_id).first()
        if not gh:
            return jsonify({"message": "No such gh!"}), 404

        sensor.zone_id = zone_id
        sensor.gh_id = gh_id
        db.session.commit()
        return jsonify({"message": "Sensor saved!"}), 200
    

@dashboard.route('/unset-sensor/<int:sensor_id>', methods=['PUT'])
def unset_sensor(sensor_id):
    if request.method == 'PUT':
        sensor = Sensor.query.filter_by(id=sensor_id).first()
        if not sensor:
            return jsonify({"message": "No such sensor!"}), 404

        # Unset the sensor from the gh and zone
        sensor.zone_id = None
        sensor.gh_id = None

        # Delete the sensors' data from "sensors_data" table.
        sensor_data_records = SensorData.query.filter_by(sensor_id=sensor_id).all()
        for record in sensor_data_records:
            db.session.delete(record)

        # Save changes to the db.
        db.session.commit()
        return jsonify({"message": "Sensor unset!"}), 200


@dashboard.route('/update-zone', methods=['PUT'])
def update_zone():
    if request.method == 'PUT':
        zone_id = request.json.get('zone_id')
        new_name = request.json.get('name')
        if not new_name:
            return jsonify({'message': 'No new name provided!'}), 400

        zone = Zone.query.filter_by(id=zone_id).first()
        if not zone:
            return jsonify({'message': 'No such zone!'}), 404

        zone.name = new_name
        db.session.commit()
        return jsonify({'message': 'Zone updated successfully!'}), 200


@dashboard.route('/delete-zone/<int:zone_id>', methods=['DELETE'])
def delete_zone(zone_id):
    if request.method == 'DELETE':
        zone = Zone.query.filter_by(id=zone_id).first()
        if not zone:
            return jsonify({"message": "No such zone!"}), 204
        
        db.session.delete(zone)
        db.session.commit()
        return jsonify({"message": "Zone deleted!"}), 200


@dashboard.route('/get-gh-parameter-data', methods=['GET'])
def get_gh_parameter_data():
    if request.method == 'GET':
        gh_id = request.args.get("gh_id")
        greenhouse = Greenhouse.query.filter_by(id=gh_id).first()
        if not greenhouse:
            return jsonify({"message": "No greenhouse with this id!"}), 404      
        
        parameter_name = request.args.get("parameter")
        parameter = Parameter.query.filter_by(name=parameter_name).first()
        if not parameter:
            return jsonify({"message": "No such parameter!"}), 404

        sensors_data = SensorData.query.filter_by(
            gh_id=gh_id,
            parameter_id=parameter.id
        ).order_by(SensorData.date.asc()).all()

        if not sensors_data:
            return jsonify({"message": "No data!"}), 404
        
        data_send = []
        for record in sensors_data:
            data_send.append({
                "date": record.date.isoformat(),
                "data": record.data
            })
        return jsonify(data_send), 200


@dashboard.route('/choose-plant', methods=['GET', 'PUT'])
def choose_plant():
    if request.method == 'GET':
        # Send the available plants from the DB.
        plants = Plant.query.all()
        if not plants:
            return jsonify({"message": "No plants!"}), 404
        
        plants_data = []
        for plant in plants:
            plant_dict = {}
            plant_dict["plant_id"] = plant.id
            plant_dict["plant_name"] = plant.name
            plants_data.append(plant_dict)
        return jsonify(plants_data), 200

    if request.method == 'PUT': 
        # Get the plant's id from the front
        plant_id = request.json.get("plant_id")
        plant = Plant.query.filter_by(id=plant_id).first()
        if not plant:
            return jsonify({"message": "No such plant!"}), 404

        zone_id = request.json.get("zone_id")
        zone = Zone.query.filter_by(id=zone_id).first()
        if not zone:
            return jsonify({"message": "No such zone!"}), 404

        if not zone.plant_id or zone.plant_id != plant_id:
            # Add the plant to the zone
            zone.plant_id = plant_id
            zone.plantation_date = func.now()

            # Get all conditions of the plant of order 1
            conditions = Condition.query\
                .filter_by(plant_id=plant_id, order=1)\
                .all()

            # Send the plants' conditions to the MQTT
            for condition in conditions:
                # Build the command
                command = {"cmd": "set_point", "value": str(condition.value)}

                # Get the topic and publish the command
                for sensor in zone.sensors:
                    if condition.parameter_id == sensor.parameter_id:
                        # Send the command
                        publish_mqtt(sensor.mqtt_topic, json.dumps(command))
                        print(command)

            # Save the changes to db
            db.session.commit()

            return jsonify({"message": "Planted!"}), 200
        return jsonify({"message": "Already planted!"}), 204
    
# if plant is grown, eliminate it from the zone