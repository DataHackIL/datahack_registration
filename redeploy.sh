#!/usr/bin/env bash
git pull
forever stopall
forever start server.js