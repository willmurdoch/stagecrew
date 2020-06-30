function stagecrew(camera, scene){
  //Initialize dat.gui, framework for controls
  var gui = new dat.GUI();

  var displayPanel = document.createElement('div');
  displayPanel.id = 'stagecrew';
  displayPanel.innerHTML = '<div class="cameracrew"></div><div class="lightcrew"></div>';
  document.body.appendChild(displayPanel);

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

  //Keep count of lights so they can get unique labels
  var lightCount = 0;
  function lightcrew(type){
    lightCount++;

    //Add new light to scene
    var light = new THREE.SpotLight(0xffffff, 1);
    var lightInit = 'new THREE.SpotLight(0xffffff, 1);';
    if(type == 'AmbientLight'){
      light = new THREE.AmbientLight(0xffffff, 1);
      lightInit = 'new THREE.AmbientLight(0xffffff, 1);';
    }
    if(type == 'PointLight'){
      light = new THREE.PointLight(0xffffff, 1);
      lightInit = 'new THREE.PointLight(0xffffff, 1);';
    }
    if(type == 'RectLight'){
      light = new THREE.RectAreaLight(0xffffff, 1, 10, 10);
      lightInit = 'new THREE.RectAreaLight(0xffffff, 1, 10, 10)';
    }
    if(type == 'DirectionalLight'){
      light = new THREE.DirectionalLight(0xffffff, 1);
      lightInit = 'new THREE.DirectionalLight(0xffffff, 1);';
    }
    //Initial position so you can see something happened
  	light.position.set(-2, 28, 35);
  	scene.add(light);

    var codeOutput = document.createElement('div');
    codeOutput.id = type + lightCount;
    codeOutput.innerHTML = 'var '+ type + lightCount + ' = ' + lightInit + '<span class="properties"></span>';
    document.querySelector('#stagecrew .lightcrew').appendChild(codeOutput);

    //Editable properties for light
    var lightFolder = gui.addFolder(type + ' ' + lightCount);
    lightFolder.add(light.position, 'x', -200,200).listen().onChange(function(val){
      document.querySelector('#' + type + lightCount + ' .properties').innerHTML = val;
    });
    lightFolder.add(light.position, 'y', -200,200).listen();
    lightFolder.add(light.position, 'z', -200,200).listen();
    lightFolder.addColor(light, 'color').listen();
    lightFolder.add(light, 'intensity', 0.01, 2.55).listen();

    // light.position.x = 40;
    // light.position.y = 9;
    // light.position.z = 31;
  }
  lightcrew('rectLight');
  lightcrew('directionalLight');
}
