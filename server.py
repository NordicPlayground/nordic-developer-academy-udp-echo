#!/usr/bin/env python3 

import os 
from _thread import * 
import socket 
import datetime 
import logging
from opencensus.ext.azure.log_exporter import AzureEventHandler

localIP     = "::" 
localPort   = 2444 
bufferSize  = 1024 
msgFromServer       = "Hello UDP Client" 
bytesToSend         = str.encode(msgFromServer) 

# Create a datagram socket 
UDPServerSocket = socket.socket(family=socket.AF_INET6, type=socket.SOCK_DGRAM) 

# Bind to address and ip 
UDPServerSocket.bind((localIP, localPort)) 

print("UDP server up and listening") 

def multi_threaded_client(message,address): 
    global UDPServerSocket 
    e = datetime.datetime.now() 
    res = b'Time: '+str.encode(e.strftime("%Y-%m-%d %H:%M:%S"))+b' Message: '+ str.encode(message.decode('utf-8')) 
    UDPServerSocket.sendto(res, address) 

# Send custom events
logger = logging.getLogger(__name__)
metrics_connection_string = os.environ.get('APPLICATIONINSIGHTS_CONNECTION_STRING')
if metrics_connection_string is not None:
    logger.addHandler(AzureEventHandler(connection_string=metrics_connection_string))
logger.setLevel(logging.INFO)

# Listen for incoming datagrams 
while(True): 
    bytesAddressPair = UDPServerSocket.recvfrom(bufferSize) 
    message = bytesAddressPair[0] 
    address = bytesAddressPair[1] 
    clientMsg = "Message from Client:{}".format(message) 
    clientIP  = "Client IP Address:{}".format(address)
    logger.info('UDP-echo')
    print(clientMsg) 
    print(clientIP) 

    # Sending a reply to client 
    start_new_thread(multi_threaded_client, (message,address )) 