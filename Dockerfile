FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get -yq install python3
COPY server.py /server.py
EXPOSE 2444/udp
CMD [ "python3", "/server.py"]
