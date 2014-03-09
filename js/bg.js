// this file is filled with hacky shit
// investigate at your own peril!
$(document).ready(function () {
  // http://mrl.nyu.edu/~perlin/noise/
  // Copyright 2002 Ken Perlin
  // ported by Anthony Cameron
  var p = new Array();
  var permutation = new Array(151,160,137,91,90,15,
     131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
     190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
     88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
     77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
     102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
     135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
     5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
     223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
     129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
     251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
     49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
     138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180);

  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(t, a, b) { return a + t * (b - a); }
  function grad(hash, x, y, z) {
    var h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
    var u = h<8 ? x : y,                 // INTO 12 GRADIENT DIRECTIONS.
        v = h<4 ? y : h==12||h==14 ? x : z;
    return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
  }

  function noise(x, y, z) {
    //console.log(x,y,z);
    var X = Math.floor(x) & 255,                  // FIND UNIT CUBE THAT
      Y = Math.floor(y) & 255,                  // CONTAINS POINT.
      Z = Math.floor(z) & 255;
    //console.log(X,Y,Z);
    x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
    y -= Math.floor(y);                                // OF POINT IN CUBE.
    z -= Math.floor(z);
    //console.log(x,y,z);
    var u = fade(x),                                // COMPUTE FADE CURVES
      v = fade(y),                                // FOR EACH OF X,Y,Z.
      w = fade(z);
    var A = p[X  ]+Y, AA = p[A]+Z, AB = p[A+1]+Z,      // HASH COORDINATES OF
      B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;      // THE 8 CUBE CORNERS,

    return lerp(w, lerp(v, lerp(u, grad(p[AA  ], x  , y  , z   ),  // AND ADD
                   grad(p[BA  ], x-1, y  , z   )), // BLENDED
               lerp(u, grad(p[AB  ], x  , y-1, z   ),  // RESULTS
                   grad(p[BB  ], x-1, y-1, z   ))),// FROM  8
           lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ),  // CORNERS
                   grad(p[BA+1], x-1, y  , z-1 )), // OF CUBE
               lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
                   grad(p[BB+1], x-1, y-1, z-1 ))));
  }

  for (var i=0; i < 256 ; i++) p[256+i] = p[i] = permutation[i];

  var turbulence = function(u,v, scale, depth, levels)
  {
    // turbulence texture
    var noiseCoef = 0;
    for (var level = 1; level < levels; level ++)
    {
      noiseCoef += (1 / level)
        * Math.abs(noise(level * scale * u,
                level * scale * v,
                depth));
    }
    return noiseCoef;
  };


  var $container = $(".flashy");
  var cw = $container.width()
  var ch = $container.height()

  var scene = new THREE.Scene();
  // var camera = new THREE.PerspectiveCamera(75, cw/ch, 0.1, 1000);
  var camera = new THREE.OrthographicCamera( cw / - 2, cw / 2, ch / 2, ch / - 2, 1, 1000 );


  ambientLight = new THREE.AmbientLight( 0xaaaaaa );
  // scene.add( ambientLight );

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.75 );
  lightX = 0;
  lightY = -1000;
  directionalLight.position.set(lightX, lightY, 2000);
  scene.add( directionalLight );


  var tx = parseInt(cw/30);
  var ty = tx * parseInt((cw/ch), 10);
  var ty = parseInt(tx * (ch/cw), 10);
  //ty = 1; // pretty damn neat

  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(cw, ch);
  $container.append(renderer.domElement);
  var geometry = new THREE.PlaneGeometry(cw*1.5,ch*1.5,tx,ty);
  var material = new THREE.MeshPhongMaterial( {
      color: 0x153433,
      ambient: 0x393333, // should generally match color
      specular: 0x535555,
      shininess: 15,
      shading: THREE.FlatShading
  } ) ;
  var cube = new THREE.Mesh(geometry, material);
  cube.rotateOnAxis(new THREE.Vector3( 1, 0, 0 ), 0.45);
  scene.add(cube);
  camera.position.z = 300;
  camera.lookAt( scene.position );
  var clamp = function (value, min, max) {
    return Math.min(Math.max(min, value), max);
  };
  DEPTH = 0;
  var alter = function () {
    for (var i = 0; i < geometry.vertices.length; i++) {
      var u = i/geometry.vertices.length - 0.5;
      var v = (i%50) / (geometry.vertices.length / 50) - 0.5;

      // u = Math.sin(u+DEPTH*0.01)
      // v = Math.cos(v+DEPTH*0.01);

      var n = turbulence(u,v,20, DEPTH, 2);
      geometry.vertices[i].z = 20*n;
    }
    geometry.verticesNeedUpdate = true;
    geometry.computeFaceNormals();
    // geometry.computeVertexNormals();
  }
  render_blocked = false;
  var render = function () {
    requestAnimationFrame(render);
    if (render_blocked) { return; }
    DEPTH += 0.0075;
    alter();
    renderer.render(scene, camera);
  };
  render();

  $(".flashy").on("mousemove", function (ev)  {
    if (ev.clientX && ev.clientY) {
      directionalLight.position.set(lightX + ev.clientX, lightY - ev.clientY, 2000);
    }
  });

  $(window).on("scroll", function (ev) {
    if (window.scrollY > ch) {
      render_blocked = true;
    } else {
      render_blocked = false;
    }
  });
});
