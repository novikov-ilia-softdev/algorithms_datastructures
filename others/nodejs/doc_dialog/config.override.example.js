var settings = module.exports = {};

settings.userSayTimeoutMs = 15000;
/*
settings.services = {};
settings.services.speech = { host: 'localhost', port: 8083 };
settings.services.geo = { host: 'localhost', port: 8084 };
settings.services.core = { host: '192.168.56.101', port: 80 };

settings.common = {};
settings.common.log_dir = 'D:/temp/voice_dialog';

settings.audioProvider = {};
settings.audioProvider.dir = 'D:/temp/voice_dialog/audio';
*/
settings.tts = { 
  engine_config: {
    apikey:"your_api_key"
  }
}

settings.city_settings = { 
  cities: 
  { 
    kamenka:  {dstPhoneNumber: '79272894339'},
    serdobsk: {dstPhoneNumber: '79270974864'}
  }
}
