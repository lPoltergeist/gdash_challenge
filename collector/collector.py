import json
import time
import requests
# type: ignore
import pika

API_KEY = "bde28fb61f5e494f1dafd2ec0302d91b"
CITY = "Rio de Janeiro"
BASE_URL = f"https://api.openweathermap.org/data/2.5/weather"
PARAMS = {
    "q": CITY,
    "appid": API_KEY,
    "lang": "pt_br",
    "units": "metric",
}

INTERVAL = 60 

RABBITMQ_HOST = 'rabbitmq'
RABBITMQ_PASS = 'rabbitmq'
RABBITMQ_USER = 'rabbitmq'


def create_channel(): 
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=RABBITMQ_HOST, credentials=credentials)
        )
    channel = connection.channel()
    
    channel.queue_declare(queue='weather_queue', durable=True)
    
    return channel

def get_weather_data():
    try:
        response = requests.get(BASE_URL, params=PARAMS)
        response.raise_for_status()
        weatherData = response.json()
    except requests.exceptions.RequestException as e:
        print("HTTP Request failed:", e)
        return None
    
    if weatherData["cod"] != 200:
         print("Error in the HTTP request")
         return None
    
    print("Weather data collected!")
    return weatherData
    
    
def send_weather_data_to_worker(channel):
    weather = get_weather_data()
    
    if weather is None:
        return
    
    body = json.dumps(weather)
    
    channel.basic_publish(
        exchange='', 
        routing_key='weather_queue', 
        body=body,
        properties=pika.BasicProperties(delivery_mode=2),
    )
    
    print(" [x] Sent weather data to worker")
    
    
def main():
    channel = create_channel()
    
    print("Starting weather data collection...")
    while True:
        send_weather_data_to_worker(channel)
        time.sleep(INTERVAL)
        
if __name__ == "__main__":
    main()
    