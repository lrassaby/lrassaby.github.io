#!/usr/bin/env bash

cd src/img
jpegoptim --size=250k *.jpg
optipng  *.png