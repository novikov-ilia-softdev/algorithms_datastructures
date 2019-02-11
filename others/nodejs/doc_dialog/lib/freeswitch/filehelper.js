module.exports = FileHelper;

var child_process = require('child_process');

function FileHelper(){
    var self = this;

    self.convertToRate16000 = function( filePath, callback){
        var recodedFilePath = filePath.replace( '.wav', '_pcm.wav');
        var command = "sox" + " " + filePath + " " + "-r" + " " + "16000" + " " + "-b" + " " + "16" + " " + "-c" + " " + "1" + " " + recodedFilePath;
        child_process.exec( command, function( err){
            callback( err, recodedFilePath);
        });
    };

    self.convertToAMR = function( filePath, callback){
        var amrFilePath = filePath.replace( '.wav', '.amr');
        var amrCommand = "ffmpeg" + " " + "-i" + " " + filePath + " " + "-ar" + " " + "8000"  + " " + "-ab" + " " + "1.2k" + " " + amrFilePath;
        child_process.exec( amrCommand, function( err){
            callback( err, amrFilePath);
        });
    };

    self.getFileDuration = function( filePath, callback){
        var command = "sox " + filePath + " -n stat 2>&1 | sed -n 's#^Length (seconds):[^0-9]*\\([0-9.]*\\)$#\\1#p'";
        child_process.exec( command, function( err, stdout, stderr){
            if( !err){
                var durationMs = ~~(parseFloat( stdout) * 1000);
                callback( null, durationMs);
            }
            else{
                callback( err);
            }
        });
    };
}
