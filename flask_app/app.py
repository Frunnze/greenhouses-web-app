from flask import Flask
from flask_migrate import Migrate
import os
import threading 
from flask_swagger_ui import get_swaggerui_blueprint 

import mqtt_connector
from db import db
from models import (
    Greenhouse, Parameter,
    Sensor, SensorData, Plant,
    Condition
)


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///greenhouse.db'
    db.init_app(app)

    # Add swagger API docs
    SWAGGER_URL = '/api/docs'  # URL for exposing Swagger UI (without trailing '/')
    API_URL = '/static/swagger.json'  # Our API url (can of course be a local resource)
    # Call factory function to create our blueprint
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,  # Swagger UI static files will be mapped to '{SWAGGER_URL}/dist/'
        API_URL,
        config={  # Swagger UI config overrides
            'app_name': "Test application"
        },
    )
    app.register_blueprint(swaggerui_blueprint)

    # Manage the routes
    from views.greenhouses import greenhouses
    from views.dashboard import dashboard
    app.register_blueprint(greenhouses, url_prefix='/')
    app.register_blueprint(dashboard)
    
    create_db(app)
    migrate = Migrate(app, db)

    return app

def create_db(app):
    if not os.path.exists("flask_app/instance/greenhouse.db"):
        with app.app_context():
            db.create_all()

            # Add initial data
            if db.session.query(Parameter).count() == 0:
                db.session.add(Parameter(name="temperature", unit="celsius"))
                db.session.add(Parameter(name="humidity", unit="%"))
                db.session.add(Parameter(name="light", unit="%"))
                db.session.add(Parameter(name="air_pressure", unit="pascal"))
                db.session.add(Parameter(name="soil_moisture", unit="%"))
                db.session.commit()   
            if db.session.query(Plant).count() == 0:
                db.session.add(Plant(name="Tomato"))
                db.session.add(Plant(name="Radish"))
                db.session.commit()   
            if db.session.query(Condition).count() == 0:
                db.session.add(Condition(plant_id=1, parameter_id=1, value=22, order=1, duration=60))
                db.session.add(Condition(plant_id=1, parameter_id=2, value=50, order=1, duration=60))
                db.session.add(Condition(plant_id=1, parameter_id=3, value=90, order=1, duration=60))
                db.session.add(Condition(plant_id=1, parameter_id=5, value=60, order=1, duration=60))

                db.session.add(Condition(plant_id=2, parameter_id=1, value=15, order=1, duration=30))
                db.session.add(Condition(plant_id=2, parameter_id=2, value=50, order=1, duration=30))
                db.session.add(Condition(plant_id=2, parameter_id=3, value=70, order=1, duration=30))
                db.session.add(Condition(plant_id=2, parameter_id=5, value=55, order=1, duration=30))
                
                db.session.commit()   
            print("DB was created!")


app = create_app()
if __name__ == '__main__': 
    # Start MQTT Subscriber in a separate thread 
    mqtt_thread = threading.Thread(target=mqtt_connector.run_mqtt_subscriber)
    mqtt_thread.start() 

    app.run(debug=False)