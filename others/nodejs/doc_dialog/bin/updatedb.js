#!/usr/bin/env node

const AudioFilesMapCreator = require('./audiofilesmapcreator');

var audioFilesMapCreator = new AudioFilesMapCreator();
audioFilesMapCreator.createAudioFilesMap( __dirname + '/../db', 'audiofilesmap.loki');
