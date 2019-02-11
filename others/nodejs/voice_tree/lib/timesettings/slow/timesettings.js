var timeSettings = module.exports = {};

timeSettings.sendNodeStateIntervalMs = 500;
timeSettings.generateWaveIntervalMs = 30000;

timeSettings.initiatorMonitoringIntervalMs = timeSettings.sendNodeStateIntervalMs;
timeSettings.routingTableMonitorIntervalMs = timeSettings.sendNodeStateIntervalMs;
timeSettings.neighborsMonitoringInrevalMs = timeSettings.sendNodeStateIntervalMs;
timeSettings.neighborLostTimeoutMs = timeSettings.sendNodeStateIntervalMs * 5;
timeSettings.updateNeighborsInfoTimeoutMs = timeSettings.sendNodeStateIntervalMs * 3;
timeSettings.waveSpreadTimeoutMs = timeSettings.updateNeighborsInfoTimeoutMs * 2 * 5;
timeSettings.notifyTwoNeighborsDelayTimeoutMs = timeSettings.sendNodeStateIntervalMs / 2;

timeSettings.netManagerReinitTimeoutMs = 10000;