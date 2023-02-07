class CCCEditor
{
    constructor(shader)
    {
        this.socket = new WebSocket(`ws://${window.location.hostname}:8080/code`);

        CodeMirror.commands.sendToCanvas = () => {
            var t = {
                type: "shader",
                // data: Buffer.from(sandbox.fragmentString, 'utf8').toString('base64')
                data: btoa(sandbox.fragmentString)
            };
            this.socket.send(JSON.stringify(t));
            console.log(sandbox.fragmentString);
        };

        this.editor = CodeMirror(document.getElementById("editor"), {
            viewportMargin: Infinity,
            lineNumbers: true,
            matchBrackets: true,
            mode:  "text/x-glsl",
            autoCloseBrackets: true,
            extraKeys: { 'Ctrl-Enter': 'sendToCanvas' },
            showCursorWhenSelecting: true,
            dragDrop: false,
            indentWithTabs: true,
            tabSize: 8,
            //lineWrapping: main.options.lineWrapping,
            autofocus: true
        });

        this.editor.on("change", () => {
            var compilation = this.tryShader(this.editor.getValue());
            if (compilation.succes)
            {
                sandbox.load(this.editor.getValue());
                this.errorMarker.style.display = 'none';
            }
            else
            {
                this.errorMarker.style.display = 'block';
                console.log(compilation.message);
                this.errorMarker.innerHTML = compilation.message;
            }
        });

        window.addEventListener('load', this.updateEditor.bind(this));

        this.errorMarker = document.getElementById("error_message");
        this.errorMarker.style.backgroundColor = "red";
        this.errorMarker.style.zIndex = 100;

        this.setupDebugger();
    }

    setupDebugger()
    {
        var canvas = document.createElement('canvas');
        // Hide the canvas
        canvas.style.width = "10px";
        canvas.style.height = "10px";
        canvas.style.display = "none";
        // Get the WebGL context
        this.gl = canvas.getContext('webgl');
        // Attach the canvas to the body
        document.body.appendChild(canvas);
        this.shaderDebug = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    }

    tryShader(sourceCode)
    {
        var gl = this.gl;
        gl.shaderSource(this.shaderDebug, sourceCode);
        gl.compileShader(this.shaderDebug);
        
        return {
            succes: gl.getShaderParameter(this.shaderDebug, gl.COMPILE_STATUS),
            message: gl.getShaderInfoLog(this.shaderDebug)
        };
    }

    updateEditor()
    {
        this.editor.setValue(sandbox.fragmentString);
        window.removeEventListener('load', this.updateEditor);
    }
}