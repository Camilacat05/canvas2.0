var cordenadas = [];

if (window.addEventListener) {
    window.addEventListener(
        "load",
        function () {
            var canvas, context, canvaso, contexto;

            var tool;
            var tool_default = "retangulo";
            var scaleFactor = document.getElementById("scaleFactor");
            var rotationFactor = document.getElementById("rotationFactor");
            var rotationFactor1 = document.getElementById("rotationFactor1");
            var translate = document.getElementById("translate");
            var reflect = document.getElementById("reflect");
            var shearTrans = document.getElementById("shear");
            var clear = document.getElementById("clr");
            

            function init() {
                canvaso = document.getElementById("canvas");
                if (!canvaso) {
                    alert("Error: I cannot find the canvas element!");
                    return;
                }

                if (!canvaso.getContext) {
                    alert("Error: no canvas.getContext!");
                    return;
                }

                contexto = canvaso.getContext("2d");
                if (!contexto) {
                    alert("Error: failed to getContext!");
                    return;
                }

                var container = canvaso.parentNode;
                canvas = document.createElement("canvas");
                if (!canvas) {
                    alert("Error: I cannot create a new canvas element!");
                    return;
                }

                canvas.id = "canvasTemp";
                canvas.width = canvaso.width;
                canvas.height = canvaso.height;
                container.appendChild(canvas);

                context = canvas.getContext("2d");
                context.strokeStyle = 'black';
                context.lineWidth = 3;
                context.fillStyle = 'black';
                context.lineJoin = context.lineCap = "round";

                var tool_select = document.getElementById("dtool");

                if (!tool_select) {
                    alert("Error: failed to get the dtool element!");
                    return;
                }

                tool_select.addEventListener("change", ev_tool_change, false);

                if (tools[tool_default]) {
                    tool = new tools[tool_default]();
                    tool_select.value = tool_default;
                }

                canvas.addEventListener("mousedown", ev_canvas, false);
                canvas.addEventListener("mousemove", ev_canvas, false);
                canvas.addEventListener("mouseup", ev_canvas, false);
                scaleFactor.addEventListener("input", scale, false);
                rotationFactor.addEventListener("input", rotation, false);
                rotationFactor1.addEventListener("click", rotation, false);
                translate.addEventListener("click", translation, false);
                reflect.addEventListener("click", reflection, false);
                shearTrans.addEventListener("click", shear, false);
                clear.addEventListener("click", erase, false);
            }

            function ev_canvas(ev) {
                if (ev.layerX || ev.layerX == 0) {
                    ev._x = ev.layerX;
                    ev._y = ev.layerY;
                } else if (ev.offsetX || ev.offsetX == 0) {
                    ev._x = ev.offsetX;
                    ev._y = ev.offsetY;
                }

                var func = tool[ev.type];
                if (func) {
                    func(ev);
                }
            }

            function ev_tool_change(ev) {
                if (tools[this.value]) {
                    tool = new tools[this.value]();
                }
            }

            function img_update() {
                contexto.drawImage(canvas, 0, 0);
                context.clearRect(0, 0, canvas.width, canvas.height);
            }

            function scale(){
                var scaleF = document.getElementById("scaleFactor").value;
                
                var lastItem = cordenadas[cordenadas.length - 1];
                var cx = lastItem[0] + 0.5 * lastItem[2]; 
                var cy = lastItem[1] + 0.5 * lastItem[3]; 
            
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.save();
            
                context.translate(cx, cy); 
                context.scale(scaleF, scaleF); 
                context.translate(-cx, -cy); 
            
                img_update();
                context.fillRect(lastItem[0], lastItem[1], lastItem[2], lastItem[3]);
            
                context.restore();
            }

            function rotation(){
                var rotateScale = document.getElementById("rotationFactor").value;
                
                var lastItem = cordenadas[cordenadas.length - 1];
                var cx =  lastItem[0] + 0.5 * lastItem[2]; 
                var cy = lastItem[1] + 0.5 * lastItem[3]; 
            
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.save();
            
                context.translate(cx, cy); 
                context.rotate((Math.PI / 180) * rotateScale); 
                context.translate(-cx, -cy); 
            
                img_update();
                context.fillRect(lastItem[0], lastItem[1], lastItem[2], lastItem[3]);
                context.restore();
            }

        

            function translation(){
                canvas.addEventListener("click", (ev) => {
                    var lastItem = cordenadas[cordenadas.length - 1];
                        x = ev.clientX - lastItem[0];
                        y = ev.clientY - lastItem[1];
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.save();
                    
                    context.translate(x, y); 

                    img_update();
                    context.fillRect(lastItem[0], lastItem[1], lastItem[2], lastItem[3]);

                    context.restore();
                }, false); 
            }
            
            
            
            function reflection(){
                
                var option = document.getElementById('refection_axis').value;
                var lastItem = cordenadas[cordenadas.length - 1];
            
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.save();

                img_update();
                if (option == 'x'){
                    lastItem[0] = canvas.width - (lastItem[0] + lastItem[2]);
                } else {          
                    lastItem[1] = canvas.height - (lastItem[1] + lastItem[3]);
                }

                context.fillRect(lastItem[0], lastItem[1], lastItem[2], lastItem[3]);
                context.restore();
            }
            
            function shear(){
                var option = document.getElementById('refection_axis').value;
                var lastItem = cordenadas[cordenadas.length - 1];
            
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.save();

                img_update();

                if (option == 'x'){
                    context.setTransform(1,0,0.5,1,0,0);
                }else{
                    context.setTransform(1,0.5,0,1,0,0);
                }
                context.fillRect(lastItem[0], lastItem[1], lastItem[2], lastItem[3]);
                context.restore();
            }

            function erase() {
                if (confirm("Deseja limpar o canvas?")) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    contexto.clearRect(0, 0, canvaso.width, canvaso.height);
                    cordenadas = [];
                }
            }

            var tools = {};

            tools.retangulo = function () {
                var tool = this;
                this.started = false;
            
                this.mousedown = function (ev) {
                    tool.started = true;
                    tool.x0 = ev._x;
                    tool.y0 = ev._y;
                };
            
                this.mousemove = function (ev) {
                    if (!tool.started) {
                        return;
                    }
            
                    var x = Math.min(ev._x,	tool.x0),
                        y = Math.min(ev._y,	tool.y0),
                        w = Math.abs(ev._x - tool.x0),
                        h = Math.abs(ev._y - tool.y0);
            
                    context.clearRect(0, 0, canvas.width, canvas.height);
            
                    if (!w || !h) {
                        return;
                    }
                    context.fillRect(x, y, w, h);
                    cordenadas.push([x,y,w,h]);
                };
            
                this.mouseup = function (ev) {
                    if (tool.started) {
                        tool.mousemove(ev);
                        tool.started = false;
                    }
                };
            };

            init();
        },
        false
    );
}