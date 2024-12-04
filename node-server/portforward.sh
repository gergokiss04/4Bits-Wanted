#!/bin/bash
sudo socat tcp-l:$1,fork,reuseaddr tcp:127.0.0.1:$2
