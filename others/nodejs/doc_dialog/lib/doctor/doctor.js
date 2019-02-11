module.exports = Doctor;

function Doctor( id, name, description, phone_number_work, phone_number_comm ){
    var self = this;

    if( !id || !name || !description || !phone_number_work || !phone_number_comm)
        throw new Error( 'not a Doctor');

    self.id = id;
    self.name = name;
    self.description = description;

    // public
    self.phone_number_work = phone_number_work;

    // private
    self.phone_number_comm = phone_number_comm;
}
