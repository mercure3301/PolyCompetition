FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    wget \
    unzip \
    curl \
    libgl1-mesa-dev \
    libglu1-mesa-dev \
    libglfw3-dev \
    libglm-dev \
    x11-apps \
    xvfb \
    x11vnc \
    websockify \
    python3 \
    python3-pip \
    nginx \
    mesa-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN pip3 install --user -q glad && \
    export PATH="$HOME/.local/bin:$PATH" && \
    mkdir -p include/glad include/KHR src && \
    python3 -m glad --generator=c --spec=gl --api=gl=3.3 --profile=core --out-path=/tmp/glad_out && \
    cp -r /tmp/glad_out/include/glad include/ && \
    cp -r /tmp/glad_out/include/KHR include/ && \
    cp /tmp/glad_out/src/glad.c src/ && \
    rm -rf /tmp/glad_out

COPY . .

RUN mkdir -p build && \
    cd build && \
    cmake .. && \
    make

ENV DISPLAY=:99

RUN git clone --depth 1 https://github.com/novnc/noVNC.git /opt/novnc

WORKDIR /app/build
RUN echo '#!/bin/bash\n\
Xvfb :99 -screen 0 1280x720x24 -ac +extension GLX +render -noreset &\n\
XVFB_PID=$!\n\
sleep 2\n\
x11vnc -display :99 -nopw -listen 0.0.0.0 -xkb -forever -shared -rfbport 5900 &\n\
VNC_PID=$!\n\
sleep 2\n\
/usr/bin/websockify --web /opt/novnc 6080 127.0.0.1:5900 &\n\
WEBSOCKIFY_PID=$!\n\
sleep 3\n\
cd /app/build\n\
DISPLAY=:99 ./OpenGL3DObjects &\n\
APP_PID=$!\n\
echo "========================================"\n\
echo "Tout est pret :)"\n\
echo "Ouvrir le navigateur a cet url :"\n\
echo "  http://localhost:6080/vnc.html"\n\
echo "========================================"\n\
wait $APP_PID\n\
' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]

