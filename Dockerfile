FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN <<EOT
    apt-get update
    apt-get -yq install python3 python3-pip
    apt-get -y clean
    rm -rf /var/lib/apt/lists/*
    python3 -m pip install opencensus-ext-azure
EOT

COPY server.py /server.py

EXPOSE 2444/udp

CMD [ "python3", "/server.py"]
