var timeSettings = module.exports = {};

timeSettings.sendNodeStateIntervalMs = 500;
timeSettings.generateWaveIntervalMs = 10000;

timeSettings.initiatorMonitoringIntervalMs = timeSettings.sendNodeStateIntervalMs;
timeSettings.routingTableMonitorIntervalMs = timeSettings.sendNodeStateIntervalMs;
timeSettings.neighborsMonitoringInrevalMs = timeSettings.sendNodeStateIntervalMs;
timeSettings.neighborLostTimeoutMs = timeSettings.sendNodeStateIntervalMs * 5;
timeSettings.updateNeighborsInfoTimeoutMs = timeSettings.sendNodeStateIntervalMs * 3;
timeSettings.waveSpreadTimeoutMs = 5000;
timeSettings.notifyTwoNeighborsDelayTimeoutMs = timeSettings.sendNodeStateIntervalMs / 2;

timeSettings.netManagerReinitTimeoutMs = 10000;