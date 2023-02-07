var gridName = "#controller_grid";
class ControlerManager
{
    _controlers = [];
    _linker =
    {
        knob: Controler_Knob,
        slider: Controler_Slider        
    }

    update() 
    {

    }

    add()
    {

    }

    remove()
    {

    }
}

class Controler_Default
{
    _settings;
    _value;

    constructor (setup)
    {

    }

    display()
    {

    }

    get toUniform()
    {
        return {
            type: "uniform"  
        }
    }
}

class Controler_Slider 
{
    //public
    _id;
    _defaultSettings = 
    {
        uniform: "u_float",
        display:
              {
                x: 2,
                y: 1
              },
        settings:
              {
                min: .0,
                max: 1.,
                value: .0,
                step:.01
              }
    };

    _href = "#controler_slider";

    getDefaultSettings() {
        return Object.assign({}, this._defaultSettings);
    }

    constructor(s = null)
    {
        this._defaultSettings.id = self.crypto.randomUUID();

        if (s === null)
        {
            return;
        }
        this._defaultSettings.id = s.id;
        this._node = document.querySelector(this._href).cloneNode(true);
        this._node.hidden = false;        
        document.querySelector(gridName).appendChild(this._node);
        this.setup(s);
        this.connectDOM();
    }

    connectDOM()
    {
        this._toWatch.addEventListener('input', this.send.bind(this));
    }

    send(event)
    {
        this.label.innerText = this.uniform + " => " + event.target.value;
        var t = 
        {
          type: "uniform",
          data: {
            type: "float",
            name: this.uniform,
            value: parseFloat(event.target.value)
          }
        }
        socket.send(JSON.stringify(t));
    }

    setup(s)
    {
        this._toWatch = this._node.querySelector("#control");
        this.label = this._node.querySelector("#txt");
        this._node.className = `c col-${s.display.x} row-${s.display.y}`
        this.uniform = s.uniform;
        this.label.innerText = this.uniform;

        Object.keys(s.settings).forEach (keys => {
            this._toWatch[keys] = s.settings[keys];
          });
    }
}

class Controler_Gyroscope
{
    //public
    _id;
    _defaultSettings = 
    {
        uniform: "u_gyro",
        display:
              {
                x: 2,
                y: 2
              },
    };

    _href = "#controler_gyroscope";

    static getDefaultSettings() {
        return Object.assign({}, this._defaultSettings);
    }

    constructor(s)
    {
        this._defaultSettings.id = self.crypto.randomUUID();

        if (s === null)
        {
            return;
        }
        this._defaultSettings.id = s.id;

        this._node = document.querySelector(this._href).cloneNode(true);
        this._node.hidden = false;        
        document.querySelector(gridName).appendChild(this._node);
        this.setup(s);
        this.connectDOM();
    }

    connectDOM()
    {
        let gyroscope = new Gyroscope({frequency: 60});

        if (window.DeviceOrientationEvent) {
            addEventListener('deviceorientation', this.send.bind(this));
            this._label.innerText = "Waiting for data";
          } else {
            this._label.innerText = "DeviceOrientationEvent is not supported";
          }
    }

    send(event)
    {
        var t = 
        {
          type: "uniform",
          data: {
            type: "vec3",
            name: this.uniform,
            value: [parseFloat(event.alpha), parseFloat(event.beta), parseFloat(event.gamma)] 
          }
        }

        this._label.innerText = `X: ${event.alpha}\nY: ${event.beta}\nZ: ${event.gamma}`;
        socket.send(JSON.stringify(t));
    }

    setup(s)
    {
        this._label = this._node.querySelector("#label");
        this._node.className = `c col-${s.display.x} row-${s.display.y}`
        this.uniform = s.uniform;
    }
}

class Controler_AmbiantLight
{
    //public
    _id;
    _defaultSettings = 
    {
        uniform: "u_light",
        display:
              {
                x: 2,
                y: 2
              },
    };

    _href = "#controler_ambiantLight";

    constructor(s)
    {
        this._node = document.querySelector(this._href).cloneNode(true);
        this._node.hidden = false;        
        document.querySelector(gridName).appendChild(this._node);
        this.setup(s);
        this.connectDOM();
    }

    connectDOM()
    {
        if ("AmbientLightSensor" in window) {
            const sensor = new AmbientLightSensor();
            sensor.addEventListener("reading", (event) => {
                this.send(sensor.illuminance);
            });
            sensor.addEventListener("error", (event) => {
                this._label.innerText = "AmbientLightSensor is not supported: " + event.error.message;
            });
            sensor.start();
        } 
        else
        {
            this._label.innerText = "AmbientLightSensor is not supported by browser";
        }
    }

    send(event)
    {
        var t = 
        {
          type: "uniform",
          data: {
            type: "float",
            name: this.uniform,
            value: parseFloat(event.illuminance) 
          }
        }

        this._label.innerText = `Light: ${event.illuminance}`;
        socket.send(JSON.stringify(t));
    }

    setup(s)
    {
        this._label = this._node.querySelector("#label");
        this._node.className = `c col-${s.display.x} row-${s.display.y}`
        this.uniform = s.uniform;
    }
}

controlerList = [
    Controler_Slider,
    Controler_Gyroscope
];