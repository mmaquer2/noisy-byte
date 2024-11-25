


const cpuSpike = (req,res) => {

    res.send("CPU Spike Scenario is running!");

}

const memoryLeak = (req, res) => {

    res.send("Memory Leak Scenario is running!");

}

const asyncStorm = (req, res) => {
    
    res.send("Async Storm Scenario is running!");
};


module.exports = {
    cpuSpike,
    memoryLeak
}