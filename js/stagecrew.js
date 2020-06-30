function stagecrew(camera, scene, lights){
  //Initialize dat.gui, framework for controls
  var gui = new dat.GUI();

  var displayPanel = document.createElement('div');
  displayPanel.id = 'stagecrew';
  displayPanel.innerHTML = '<div id="stagecrewCode"><div class="cameracrew"></div><div class="lightcrew"></div></div><button id="stagecrewCopy">COPY</button>';
  document.body.appendChild(displayPanel);

  //Copy button
  document.getElementById('stagecrewCopy').addEventListener('click', function(){
    if (window.getSelection) {
      var range = document.createRange();
      range.selectNode(document.getElementById('stagecrewCode'));
      window.getSelection().addRange(range);
      document.execCommand("copy");
      alert("Text has been copied, now paste in the text-area");
    }
  });

  //Camera controls
  function cameracrew(){
    //Create controls for camera
    var cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(camera.position, 'x', -10, 10).listen();
    cameraFolder.add(camera.position, 'y', -10, 10).listen();
    cameraFolder.add(camera.position, 'z', -10, 10).listen();
    cameraFolder.add(camera.rotation, 'x', -Math.PI, Math.PI).listen();
    cameraFolder.add(camera.rotation, 'y', -Math.PI, Math.PI).listen();
    cameraFolder.add(camera.rotation, 'z', -Math.PI, Math.PI).listen();
    cameraFolder.add(camera, 'fov', 30, 120).listen().onChange(function(){
      camera.updateProjectionMatrix();
    });
    cameraFolder.open();
  }
  cameracrew();

  //Light controls
  function lightcrew(type){

    //Add new light to scene
    var light = new THREE.SpotLight(0xffffff, 1);
    var lightInit = 'new THREE.SpotLight(0xffffff, 1)';
    if(type == 'ambientLight'){
      light = new THREE.AmbientLight(0xffffff, 1);
      lightInit = 'new THREE.AmbientLight(0xffffff, 1)';
    }
    if(type == 'pointLight'){
      light = new THREE.PointLight(0xffffff, 1);
      lightInit = 'new THREE.PointLight(0xffffff, 1)';
    }
    if(type == 'rectLight'){
      light = new THREE.RectAreaLight(0xffffff, 1, 10, 10);
      lightInit = 'new THREE.RectAreaLight(0xffffff, 1, 10, 10)';
    }
    if(type == 'directionalLight'){
      light = new THREE.DirectionalLight(0xffffff, 1);
      lightInit = 'new THREE.DirectionalLight(0xffffff, 1)';
    }
    //Initial position so you can see something happened
  	light.position.set(-2, 28, 35);
  	scene.add(light);

    var myProps = [];
    var codeOutput = document.createElement('div');
    codeOutput.id = type + light.id;
    codeOutput.innerHTML = '<div class="light">var '+ type + light.id + ' = ' + lightInit + ';' + '</div><div class="properties"></div>';
    document.querySelector('#stagecrew .lightcrew').appendChild(codeOutput);

    //Editable properties for light
    var lightFolder = gui.addFolder(type + ' ' + light.id);
    lightFolder.add(light.position, 'x', -500,500).listen().onChange(function(val){
      myProps[type + light.id + '.position.x'] = val.toFixed(3);
    });
    lightFolder.add(light.position, 'y', -500,500).listen().onChange(function(val){
      myProps[type + light.id + '.position.y'] = val.toFixed(3);
    });
    lightFolder.add(light.position, 'z', -500,500).listen().onChange(function(val){
      myProps[type + light.id + '.position.z'] = val.toFixed(3);
    });
    lightFolder.addColor(light, 'color').listen().onChange(function(val){
      myProps[type + light.id + '.color'] = val;
    });
    lightFolder.add(light, 'intensity', 0.01, 2.55).listen().onChange(function(val){
      myProps[type + light.id + '.intensity'] = val.toFixed(3);
    });
    if(type == 'spotLight'){
      lightFolder.add(light, 'penumbra', -0.01, 1.01).listen().onChange(function(val){
        myProps[type + light.id + '.penumbra'] = val.toFixed(3);
      });
    }
    if(type == 'rectLight'){
      lightFolder.add(light.rotation, 'x', -Math.PI, Math.PI).listen().onChange(function(val){
        myProps[type + light.id + '.rotation.x'] = val.toFixed(3);
      });
      lightFolder.add(light.rotation, 'y', -Math.PI, Math.PI).listen().onChange(function(val){
        myProps[type + light.id + '.rotation.y'] = val.toFixed(3);
      });
      lightFolder.add(light.rotation, 'z', -Math.PI, Math.PI).listen().onChange(function(val){
        myProps[type + light.id + '.rotation.z'] = val.toFixed(3);
      });
    }

    //Loop to regenerate code for changed properties
    setInterval(function(){
      for (var key in myProps){
        if (myProps.hasOwnProperty(key)){
          var lightCode = key + ' = ' + myProps[key] + ';';
          var lightID = key.split('.')[0];
          if(!document.querySelector('#stagecrew #' + lightID + ' .properties [data-prop="' + key + '"]')){
            var myProperty = document.createElement('div');
            myProperty.dataset.prop = key;
            document.querySelector('#stagecrew #' + lightID + ' .properties').appendChild(myProperty);
          }
          else document.querySelector('#stagecrew #' + lightID + ' .properties [data-prop="' + key + '"]').innerHTML = lightCode;
        }
      }
    }, 1500);
  }
  for (var i = 0; i < lights.length; i++) {
    lightcrew(lights[i]);
  }

}
