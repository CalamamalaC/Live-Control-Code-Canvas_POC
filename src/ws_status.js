class WsStatus{

    constructor(ws)
    {
        this.ws = ws;
        this.label = document.createElement('p');
        this.label.style.position = "fixed";
        this.label.style.bottom = "0";
        this.label.style.width = "100%";
        this.label.style.background = "black";
        this.label.style.color = "white";
        document.body.appendChild(this.label);

        ws.addEventListener('open', this.open.bind(this));
        ws.addEventListener('close', this.close.bind(this));
        ws.addEventListener('error', this.error.bind(this));
        ws.addEventListener('message', this.message.bind(this));

        this.init();
    }

    init()
    {
        this.label.innerHTML = "Pending...";
        this.label.style.backgroundColor = 'grey';
    }

    open(event)
    {
        this.update(`Connected: ${this.ws.url} `, 'green');
    }

    close(event)
    {
        this.update(`Connection closed: ${event}`, 'orange');
    }

    message(event)
    {
        var data;
        console.log(event);
        try 
        {
            data = JSON.parse(event.data).stringify();
        } 
        catch
        {
            data = event.data;
        }
        this.update(`Connected: ${this.ws.url} | Last Message: ${data} | ${Date.now()}`, 'green');
    }
    
    error(event)
    {
        this.update(`Connection error: ${event}`, 'red');
    }

    update(msg, color)
    {
        this.label.innerHTML = msg;
        this.label.style.background = color;
    }
}