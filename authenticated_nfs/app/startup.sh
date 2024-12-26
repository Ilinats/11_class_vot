#!/bin/sh

mount -t nfs -o vers=4,async,noatime,nodiratime,norelatime nfs:/ mnt-nfs

python app.py