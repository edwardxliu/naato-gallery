(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,52144,83055,e=>{"use strict";var t=e.i(43476),r=e.i(932),o=e.i(75056),i=e.i(71645),n=e.i(46944),l=e.i(47228),a=e.i(31082),u=e.i(85966),s=e.i(1335),c=e.i(47071),h=e.i(71753),f=e.i(15080),d=e.i(90072),v=e.i(28611),g=e.i(11826);let m=`
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFoldProgress;
  uniform vec2 uFoldOrigin;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uPointerAmplitude;
  uniform vec2 uHalftoneSize;
  uniform float uHalftoneDotSize;
  uniform float uHalftoneStrength;
  uniform float uMorphProgress;
  uniform float uDistortionStrength;
  uniform float uPointerActive;
  

    vec2 rotate2D(vec2 position, float angle) {
        mat2 rotationMatrix = mat2(cos(angle), -sin(angle),
                                sin(angle),  cos(angle));
        return rotationMatrix * position;
    }

mat4 rotation3d(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(
    oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
    0.0,                                0.0,                                0.0,                                1.0
  );
}
  void main() {
    vUv = uv;
    vec3 newPosition = position;
    
    // Paper fold effect starting from the bottom-left corner
    // The fold propagates diagonally across the paper
    
    // Distance from fold origin (in UV space)
    float cornerDist = length(uv - uFoldOrigin);
    
    // Anchor the corner - reduce effect near the origin corner
    float cornerAnchor = smoothstep(0.0, 0.35, cornerDist);
    
    // Create a traveling fold line that moves across the cloth
    float foldLine = uFoldProgress * 2.2; // The fold line position (0 to ~2.2 for full diagonal with overshoot)
    
    // Distance from the current fold line
    float distFromFold = cornerDist - foldLine;
    
    // Create a wider, softer cloth-like fold effect with actual geometric folding
    // Cloth lifts before the fold line and settles after with multiple waves
    float foldWidth = 0.85;
    
    // Softer, more gradual fold region for cloth-like feel
    float inFoldRegion = smoothstep(-foldWidth, 0.0, distFromFold) * (1.0 - smoothstep(0.0, foldWidth * 0.7, distFromFold));
    
    // Calculate fold angle - cloth bends along the crease
    // Areas before the fold line rotate upward, creating actual folding
    float foldAngle = 0.0;
    float creaseIntensity = 0.0;
    
    if (distFromFold < 0.0) {
      // Before the fold line - this part should fold over
      float foldProgress = smoothstep(-foldWidth * 1.2, 0.0, distFromFold);
      foldAngle = foldProgress * uFoldProgress * 0.7; // Reduced fold angle
      creaseIntensity = inFoldRegion * cornerAnchor;
    } else {
      // After the fold line - settled area
      creaseIntensity = inFoldRegion * cornerAnchor;
    }
    
    // Primary fold - softer, more flowing crease (anchored at corner)
    // Use a smoother curve for cloth-like behavior
    float crease = creaseIntensity * uAmplitude * 0.7 * (1.0 + sin(distFromFold * 4.0 + uTime * 2.0) * 0.1);
    
    // Apply actual geometric folding - rotate vertices around the fold line
    // Calculate direction from fold origin to current point
    vec2 dirFromOrigin = normalize(uv - uFoldOrigin);
    vec2 perpendicularDir = vec2(-dirFromOrigin.y, dirFromOrigin.x); // Perpendicular to fold direction
    
    // Rotate position around the fold line - reduced intensity
    float foldRotation = foldAngle * uAmplitude * 0.5;
    mat2 rotationMatrix = mat2(cos(foldRotation), -sin(foldRotation), sin(foldRotation), cos(foldRotation));
    
    // Only apply rotation to areas before the fold line
    float rotationMask = smoothstep(0.0, -foldWidth * 1.5, distFromFold);
    vec2 rotatedPos = mix(position.xy, (rotationMatrix * (position.xy - vec2(0.5)) + vec2(0.5)), rotationMask * cornerAnchor);
    
    // Blend between original and rotated position - reduced blend
    newPosition.xy = mix(position.xy, rotatedPos, uFoldProgress * 0.35);
    
    // Add subtle ripples behind the main fold (like cloth settling and draping)
    // First ripple - close to fold, reduced intensity
    float ripple1 = smoothstep(-foldWidth * 2.5, -foldWidth * 0.9, distFromFold) * 
                    (1.0 - smoothstep(-foldWidth * 0.9, 0.0, distFromFold));
    float settlingWave1 = ripple1 * uAmplitude * 0.18 * sin(distFromFold * 7.5 + uTime * 2.0) * cornerAnchor;
    
    // Second ripple - medium distance, flowing
    float ripple2 = smoothstep(-foldWidth * 4.0, -foldWidth * 2.2, distFromFold) * 
                    (1.0 - smoothstep(-foldWidth * 2.2, -foldWidth * 1.3, distFromFold));
    float settlingWave2 = ripple2 * uAmplitude * 0.12 * sin(distFromFold * 6.0 + uTime * 1.5 + 1.2) * cornerAnchor;
    
    // Third ripple - further back, subtle
    float ripple3 = smoothstep(-foldWidth * 6.0, -foldWidth * 3.5, distFromFold) * 
                    (1.0 - smoothstep(-foldWidth * 3.5, -foldWidth * 2.5, distFromFold));
    float settlingWave3 = ripple3 * uAmplitude * 0.08 * sin(distFromFold * 4.5 + uTime * 1.1 + 2.3) * cornerAnchor;
    
    // Combine settling waves
    float settlingWave = settlingWave1 + settlingWave2 + settlingWave3;
    
    // Paper ripple distortion effect (from intro background)
    float pointerDist = length(uv - uPointer);
    float rippleRadius = 0.35;
    float rippleFalloff = smoothstep(rippleRadius, 0.0, pointerDist);
    float ripple = pow(rippleFalloff, 2.0);
    
    // Gentle wave distortion - very slow animation when stationary
    float wave = sin(pointerDist * 12.0 - uTime * 0.3) * 0.5 + 0.5;
    float distortion = ripple * wave * uDistortionStrength * uPointerActive;
    float pointerDistortion = distortion * 0.08;
    
    // Combine effects with cloth-like pointer interaction
    // Reduced intensity for subtler response
    float pointerFalloff = smoothstep(0.6, 0.0, pointerDist);
    float pointerBend = pow(pointerFalloff, 1.8);
    float pointerRipple = pointerBend * uPointerStrength * uPointerAmplitude * 0.7;
    
    // Add subtle secondary pointer waves
    float pointerWave1 = pointerBend * uPointerStrength * uPointerAmplitude * 0.2 * 
                        sin(pointerDist * 12.0 + uTime * 3.0);
    pointerRipple = pointerRipple + pointerWave1;
    
    // Add subtle cloth-like undulation across the entire surface
    // Reduced intensity for less distortion
    float wave1 = sin(uv.x * 3.14159 * 3.2 + uTime * 1.1) * 
                  sin(uv.y * 3.14159 * 2.8 + uTime * 0.9) * 
                  uAmplitude * 0.06 * (1.0 - uFoldProgress * 0.5);
    
    float wave2 = sin((uv.x + uv.y) * 3.14159 * 2.0 + uTime * 0.7) * 
                  sin((uv.x - uv.y) * 3.14159 * 1.8 + uTime * 0.5) * 
                  uAmplitude * 0.04 * (1.0 - uFoldProgress * 0.4);
    
    float globalUndulation = wave1 + wave2;
    
    // Add subtle gravity-like draping effect
    float gravityDrape = sin(uv.y * 3.14159 * 1.5) * uAmplitude * 0.03 * (1.0 - uFoldProgress * 0.7);

    float halftoneAngle = 0.35;
    mat2 halftoneRotation = mat2(cos(halftoneAngle), -sin(halftoneAngle), sin(halftoneAngle), cos(halftoneAngle));
    vec2 halftoneCenter = (uv - 0.5) * uHalftoneSize;
    vec2 halftoneUv = (halftoneRotation * halftoneCenter + 0.5 * uHalftoneSize) / uHalftoneDotSize;
    vec2 halftoneCell = fract(halftoneUv) - 0.5;
    float halftoneDist = length(halftoneCell);
    float halftoneDot = smoothstep(0.48, 0.2, halftoneDist);
    float halftoneDisplacement = uMorphProgress * uHalftoneStrength * (halftoneDot - 0.5) * 0.08;

    if(true){
      newPosition.z =  pointerRipple + pointerDistortion + halftoneDisplacement + gravityDrape;
    }

    // newPosition = (rotation3d(vec3(0. , 0., 1.),  uAngle * 3.14 * 1.) * vec4(pos, 1.)).xyz;
    // newPosition = (rotation3d(vec3(0.05 , 0.1, 0.),  3.14 * flipProgress * 2. ) * vec4(newPosition, 1.)).xyz;


    vec2 m = uPointer * 2.0 - 1.0; // mouse uv -1 - 1
    vec2 vPos = uv * 2.0 - 1.0;  // vertex uv -1 - 1
    float angle = atan(-m.y, -m.x);
    vec2 uv2 = uv;
    uv2 -= 0.5;
    uv2 = rotate2D(uv2, angle) ;
    uv2 += .5;


    float len = length(m);
    float flipProgress = smoothstep(0.0 + uv2.x * 0.2, 0.8 + uv2.x * 0.2, .1 * len);
     // newPosition = (rotation3d(vec3(m.x, m.y, 1.),3.14 * flipProgress * 1.0) * vec4(newPosition, 1.0)).xyz;


    float flipProgress2 = smoothstep(0. + uv.x * 0.3, 0.8 + uv.x * 0.2, uFoldProgress  );
    newPosition = (rotation3d(vec3(0.5 * (1.- flipProgress2 ) , 1., 0.),  3.14 * flipProgress2 * 1. ) * vec4(newPosition, 1.)).xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`,p=`
  uniform sampler2D uTexture;
  uniform vec2 vUvScale;
  uniform float uOpacity;
  uniform vec2 uPointer;
  uniform vec2 uHalftoneSize;
  uniform float uHalftoneDotSize;
  uniform float uHalftoneStrength;
  uniform vec3 uHalftoneColor;
  uniform float uMorphProgress;
  uniform float uTime;
  varying vec2 vUv;
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

 float regularLine(vec2 uv, float fadeBottom, float fadeTop){

        float center = 0.0 + uv.x;

        return  smoothstep(center - fadeBottom, center, uv.y )
                - smoothstep(center, center + fadeTop, uv.y );
    }

    float easeOutQuart(float x) {
    return 1.0 - pow(1.0 - x, 4.0);
}
  void main() {

    vec2 uv2 = vUv;
    if (!gl_FrontFacing) {
      uv2.x = 1.0 - uv2.x; // horizontal flip on backface
    }
    vec2 uv = (uv2 - 0.5) * vUvScale + 0.5;
    vec4 color = texture2D(uTexture, uv);
    float luma = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
    float halftoneAngle = 0.35;
    mat2 halftoneRotation = mat2(cos(halftoneAngle), -sin(halftoneAngle), sin(halftoneAngle), cos(halftoneAngle));
    vec2 halftoneCenter = (uv - 0.5) * uHalftoneSize;
    vec2 halftoneUv = (halftoneRotation * halftoneCenter + 0.5 * uHalftoneSize) / uHalftoneDotSize;
    vec2 cell = fract(halftoneUv) - 0.5;
    float dist = length(cell);
    float dotRadius = mix(0.26, 0.68, 1.0 - luma);
    float dotMask = smoothstep(dotRadius, dotRadius - 0.02, dist);
    
    // Radial reveal effect - halftone expands outward from pointer
    float pointerDist = distance(uv, uPointer);
    
    // Calculate reveal radius with easing for smoother expansion
    // Max radius covers most of the screen (diagonal is ~1.414)
    float maxRevealRadius = 1.2;
    
    // Apply easing to halftone strength for smoother reveal
    // Ease-out for smooth start, ease-in for smooth end
    float revealRadiusEased = uHalftoneStrength < 0.5 
      ? 2.0 * uHalftoneStrength * uHalftoneStrength  // Ease-out (smooth start)
      : 1.0 - 2.0 * (1.0 - uHalftoneStrength) * (1.0 - uHalftoneStrength); // Ease-in (smooth end)
    
    float revealRadius = revealRadiusEased * maxRevealRadius;
    
    // Increased feathering for smoother, softer edge
    float revealFeather = 0.4;
    float revealMask = 1.0 - smoothstep(revealRadius - revealFeather, revealRadius, pointerDist);
    
    // Add subtle noise to the reveal edge for organic feel
    float edgeNoise = (hash((uv - uPointer) * 60.0) - 0.5) * 0.04;
    float revealDistWithNoise = pointerDist + edgeNoise;
    float revealMaskNoisy = 1.0 - smoothstep(revealRadius - revealFeather, revealRadius, revealDistWithNoise);
    
    // Combine smooth and noisy masks for natural reveal
    float revealMaskFinal = mix(revealMask, revealMaskNoisy, 0.25);
    
    // Smooth halftone blend transition with easing
    float halftoneStrengthEased = smoothstep(0.0, 1.0, uHalftoneStrength);
    float halftoneBlend = clamp(halftoneStrengthEased * (1.0 - uMorphProgress) * 1.2, 0.0, 1.0);
    
    // Apply reveal mask to halftone blend - halftone only appears within reveal area
    halftoneBlend *= revealMaskFinal;
    
    vec3 paperColor = mix(color.rgb, uHalftoneColor, 0.85);
    vec3 halftoneDots = mix(paperColor, color.rgb, dotMask);
    vec3 halftoneBase = mix(color.rgb, halftoneDots, halftoneBlend);
    halftoneBase = mix(halftoneBase, color.rgb, uMorphProgress);
    halftoneBase = color.rgb;
    
    // Original reveal window for the image reveal effect
    float imageRevealRadius = 0.28;
    float imageRevealFeather = 0.22;
    float imageRevealEdgeNoise = (hash((uv - uPointer) * 120.0) - 0.5) * 0.07;
    float imageRevealDist = distance(uv, uPointer) + imageRevealEdgeNoise;
    float imageRevealRadiusJitter = imageRevealRadius + (hash(uv * 45.0) - 0.5) * 0.04;
    float revealWindow = 1.0 - smoothstep(imageRevealRadiusJitter, imageRevealRadiusJitter + imageRevealFeather, imageRevealDist);
    revealWindow = pow(revealWindow, 0.8);
    vec3 finalColor = mix(color.rgb, halftoneBase, revealWindow);

        vec2 uv1 = vUv - .5;

  
        float numPulses = 3.0;

        float result = 0.0;

        float fadeBottom = 0.05;
        float fadeTop = .5;

        float uProgress = mod(uTime * 0.2, 2.);
        for (int i = 0; i < 1; i++) {
            float offset = float(i) / numPulses ; 

            float t = uProgress + offset; // 0 to 1 looping, each offset


            
            float mapped = t * (2.0 + fadeTop + fadeBottom) - 1. - fadeBottom;

            vec2 uv3 = uv1;

            uv3.y += mapped;


            result = max(result, regularLine(uv3, fadeBottom, fadeTop));
        }

        float pct = result * 0.01 * 1.;

    if(true){
        finalColor = (1.0 - pct) * finalColor + pct * vec3(1., 1., 1.);
    }

    gl_FragColor = vec4(finalColor, color.a );
  }
`,w=(0,g.createBezierEasing)(...g.easeInOut.quart);function P(e){let{mode:r,imageSrc:o,sourcePosition:n,targetPosition:l,isTransitionAnimationEnabled:a=!0,hoverElement:u,hoverSourceRect:s,hoverPointer:g,isHoverActive:P=!1,hoverRotation:R,halftoneColor:x=[1,1,1],disableTransitionDistortion:A=!1,onAnimationCompleteAction:S,onCanvasReadyAction:T}=e,y=i.useRef(null),F=(0,c.useTexture)(o),I=F.image,{viewport:M,size:E,clock:H}=(0,f.useThree)(),D=i.useRef(!1),C=i.useRef(!1),_=i.useRef(!1),b=i.useRef(!1),W=i.useRef(r),U=i.useRef(a),N=i.useCallback(e=>{if(!e.width||!e.height)return{scaleX:0,scaleY:0};if(!I.width||!I.height)return{scaleX:e.width/E.width*M.width,scaleY:e.height/E.height*M.height};let t=I.width/I.height,r=e.width/e.height>t,o=r?e.height*t:e.width,i=r?e.height:e.width/t;return{scaleX:o/E.width*M.width,scaleY:i/E.height*M.height}},[E.width,E.height,M.width,M.height,I.height,I.width]),O=i.useCallback(e=>{let t=N(e);return{scaleX:t.scaleX,scaleY:t.scaleY,centerX:((e.left+e.width/2)/E.width-.5)*M.width,centerY:-((e.top+e.height/2)/E.height-.5)*M.height}},[N,E.height,E.width,M.height,M.width]),B=i.useMemo(()=>O(n),[n,O]),L=i.useMemo(()=>l?O(l):null,[l,O]),k=i.useMemo(()=>{let e="transition"===r&&l?l:n,t=Math.min(e.width,e.height),o=Math.min(E.width,E.height);return t&&o?d.MathUtils.clamp(t/o*2.2,.4,1):1},[r,n,l,E.height,E.width]),z=i.useRef(H.elapsedTime),X=i.useRef(B),Y=i.useRef(L),j=i.useRef({uTime:{value:0},uAmplitude:{value:0},uFoldProgress:{value:0},uFoldOrigin:{value:new d.Vector2(0,0)},uPointer:{value:new d.Vector2(0,0)},uPointerStrength:{value:0},uPointerAmplitude:{value:0},uHalftoneSize:{value:new d.Vector2(1,1)},uHalftoneDotSize:{value:6.5},uHalftoneStrength:{value:0},uHalftoneColor:{value:new d.Vector3(1,1,1)},uMorphProgress:{value:0},uTexture:{value:F},vUvScale:{value:new d.Vector2(1,1)},uOpacity:{value:0},uDistortionStrength:{value:.6},uPointerActive:{value:0}});i.useEffect(()=>{if(!y.current)return;let e=y.current.material;e.uniforms.uTexture.value=F,e.needsUpdate=!0},[F]);let V=i.useCallback(e=>{y.current&&(y.current.scale.set(e.scaleX,e.scaleY,1),y.current.position.set(e.centerX,e.centerY,0))},[]),G=i.useCallback(e=>{if(!y.current||!M.width||!M.height)return;let t=y.current.scale.x/M.width*E.width,r=y.current.scale.y/M.height*E.height;t&&r&&(e.uHalftoneSize.value.set(t,r),e.uHalftoneDotSize.value=6.5)},[E.height,E.width,M.height,M.width]);i.useEffect(()=>{"hover"===W.current&&"transition"===r&&(z.current=H.elapsedTime,D.current=!1),W.current=r},[r,H]),i.useEffect(()=>{y.current&&(X.current=O(n),l?Y.current=O(l):Y.current=null,("hover"===r||!l||H.elapsedTime-z.current<.01)&&X.current&&V({scaleX:X.current.scaleX,scaleY:X.current.scaleY,centerX:X.current.centerX,centerY:X.current.centerY}),y.current.material.uniforms.vUvScale.value.set(1,1))},[V,H,r,n,l,O]);let K=i.useRef(H);K.current=H;let q=i.useRef(T);q.current=T,i.useEffect(()=>{if("transition"!==r){U.current=!0;return}if(!a){U.current=!1;return}U.current||(z.current=K.current.elapsedTime,D.current=!1),U.current=!0},[a,r]);let J=i.useRef(g),$=i.useRef(null),Q=i.useRef(0),Z=i.useRef(null),ee=i.useRef(null),et=i.useRef(!1),er=i.useRef(0),eo=i.useRef(0),ei=i.useRef(0),en=i.useRef(0);J.current=g;let el=i.useCallback(()=>{!_.current||C.current||q.current&&(C.current=!0,q.current())},[]);return i.useEffect(()=>{if(z.current=K.current.elapsedTime,"hover"===r){b.current=!0,C.current=!1;return}D.current=!1,b.current=!0,C.current=!1},[r]),(0,h.useFrame)(()=>{if(!y.current)return;"hover"===r?y.current.rotation.z=R?-R:0:y.current.rotation.z=0;let e="transition"===r&&A,t=y.current.material.uniforms;t.uTime.value+=.04,t.uHalftoneColor.value.set(x[0],x[1],x[2]);let o="hover"===r?J.current:null;if($.current||($.current=new d.Vector2(.5,.5)),o){let e=H.elapsedTime,t=Z.current,r=ee.current;if(t&&null!==r){et.current||$.current.set(o.x,o.y);let i=Math.max(e-r,.001),n=o.x-t.x,l=o.y-t.y,a=Math.sqrt(n*n+l*l);en.current+=a,en.current>.01&&(et.current=!0);let u=d.MathUtils.clamp(a/i*1.2,0,1);Q.current=d.MathUtils.lerp(Q.current,u,.18)}else Q.current=d.MathUtils.lerp(Q.current,0,.12);Z.current=o,ee.current=e,$.current.lerp(new d.Vector2(o.x,o.y),.05)}else Q.current=d.MathUtils.lerp(Q.current,0,.12),Z.current=null,ee.current=null,et.current=!1,en.current=0;let i=$.current;t.uPointer.value.set(i.x,i.y);let n="transition"===r?new d.Vector2(0,0):i;t.uFoldOrigin.value.copy(n),t.uPointerStrength.value=Q.current;let c="transition"!==r||a,h=H.elapsedTime-z.current,f=h/v.FLIP_PAGE_TRANSITION_DURATION_S,g=.3*v.FLIP_PAGE_TRANSITION_DURATION_S;if("hover"===r){t.uAmplitude.value=0,t.uFoldProgress.value=0,er.current=d.MathUtils.lerp(er.current,+!!P,.2),t.uOpacity.value=er.current,eo.current=d.MathUtils.lerp(eo.current,0,.15),t.uMorphProgress.value=eo.current,t.uPointerAmplitude.value=.4*k*.2*(1-eo.current),t.uHalftoneStrength.value=d.MathUtils.lerp(t.uHalftoneStrength.value,+!!P,P?.015:.004);let e=o&&et.current?1:0;if(ei.current=d.MathUtils.lerp(ei.current,e,.03),t.uPointerActive.value=ei.current,_.current=t.uOpacity.value>0&&b.current,u){let e=u.getBoundingClientRect(),t=e.left+e.width/2,r=e.top+e.height/2,o=s?.width??e.width,i=s?.height??e.height,n=O({left:t-o/2,top:r-i/2,width:o,height:i});X.current=n,V(n)}else X.current&&V(X.current);G(t);return}if(!c){t.uOpacity.value=1,_.current=b.current,t.uAmplitude.value=0,t.uFoldProgress.value=0,eo.current=0,Q.current=0,ei.current=0,t.uMorphProgress.value=0,t.uPointerStrength.value=0,t.uPointerAmplitude.value=0,t.uHalftoneStrength.value=0,t.uPointerActive.value=0,X.current&&V(X.current),G(t);return}if(t.uOpacity.value=+(f>.01),_.current=t.uOpacity.value>0&&b.current,e&&(eo.current=0,Q.current=0,ei.current=0,t.uMorphProgress.value=0,t.uPointerStrength.value=0,t.uPointerAmplitude.value=0,t.uHalftoneStrength.value=0,t.uPointerActive.value=0),e||(eo.current=d.MathUtils.clamp(h/g,0,1),t.uMorphProgress.value=eo.current,t.uPointerAmplitude.value=.4*k*.5*(1-eo.current),t.uHalftoneStrength.value=d.MathUtils.lerp(t.uHalftoneStrength.value,0,.15)),!b.current)return void G(t);let m=X.current,p=Y.current;if(l&&m&&p){let e=w(Math.min(f,1)),t=m.scaleX+(p.scaleX-m.scaleX)*e,r=m.scaleY+(p.scaleY-m.scaleY)*e,o=m.centerX+(p.centerX-m.centerX)*e,i=m.centerY+(p.centerY-m.centerY)*e;y.current.scale.set(t,r,1),y.current.position.set(o,i,0)}if(l&&!D.current&&S&&h>=v.FLIP_PAGE_TRANSITION_DURATION_S&&(D.current=!0,S()),e&&(t.uAmplitude.value=0,t.uFoldProgress.value=0,!l&&!D.current&&S&&h>=v.FLIP_PAGE_TRANSITION_DURATION_S&&(D.current=!0,S())),!e&&h<v.FLIP_PAGE_TRANSITION_DURATION_S){var T;t.uFoldProgress.value=-(Math.cos(Math.PI*f)-1)/2;let e=(T=f)<.4?1-(1-T/.4)**4:T>.6?((1-T)/.4)**4:1;t.uAmplitude.value=.4*k*e}!e&&h>=v.FLIP_PAGE_TRANSITION_DURATION_S&&(t.uAmplitude.value=0,t.uFoldProgress.value=1,l||D.current||!S||(D.current=!0,S())),G(t)}),(0,t.jsxs)("mesh",{ref:y,onAfterRender:el,children:[(0,t.jsx)("planeGeometry",{args:[1,1,60,60]}),(0,t.jsx)("shaderMaterial",{transparent:!0,wireframe:!1,fragmentShader:p,vertexShader:m,uniforms:j.current,side:d.DoubleSide})]})}var R=e.i(69386);function x(e){if(void 0===window.DOMMatrix)return{rotation:0,scaleX:1,scaleY:1};let t=e,r=[];for(;t&&t!==document.body;){let e=window.getComputedStyle(t).transform;e&&"none"!==e&&r.push(new DOMMatrix(e)),t=t.parentElement}let o=new DOMMatrix;for(let e=r.length-1;e>=0;e-=1)o=o.multiply(r[e]);let{a:i,b:n,c:l,d:a}=o,u=Math.sqrt(i*i+n*n);return{rotation:Math.atan2(n,i),scaleX:u,scaleY:Math.sqrt(l*l+a*a)}}function A(e){return{width:e.offsetWidth||e.clientWidth,height:e.offsetHeight||e.clientHeight}}function S(e,t,r,o){if(!e||!t||!r||!o)return{width:0,height:0};let i=e/t;return i>r/o?{width:r,height:r/i}:{width:o*i,height:o}}function T(e){let t=e.getBoundingClientRect(),r=window.getComputedStyle(e).objectFit;if(!r||"fill"===r)return{width:t.width,height:t.height};let o=e.naturalWidth||t.width,i=e.naturalHeight||t.height;if("cover"===r){let e=o/i;return e>t.width/t.height?{width:t.height*e,height:t.height}:{width:t.width,height:t.width/e}}return S(o,i,t.width,t.height)}function y(e,t,r){let o=e.getBoundingClientRect();return{left:o.left+o.width/2-t/2,top:o.top+o.height/2-r/2,width:t,height:r}}function F(e){let t,o,n,l,s,h,f,d,g,m,p,w,P,F,H,D,C,_=(0,r.c)(58),{src:b,paperEffectId:W,hasPaperHover:U,onImageElementAction:N,hoverElementRef:O}=e,B=(0,u.useBreakpoint)(E),L=(0,R.usePaperEffectStore)(M),k=(0,R.usePaperEffectStore)(I),z=i.useRef(null);if(_[0]!==b)t="string"==typeof b?{src:b,width:0,height:0}:"default"in b?b.default:b,_[0]=b,_[1]=t;else t=_[1];let X=t,Y=X.src,j=W??Y,V=i.useRef(null),G=i.useRef(!1),[K,q]=i.useState(!1),J=i.useRef(0),$=void 0!==U&&U&&B&&"false"!==a.env.NEXT_PUBLIC_FULL_SITE_ENABLED;_[2]!==$?(o=e=>{if(!$)return;let t=(0,v.getImageSrc)(e);t&&c.useTexture.preload(t)},_[2]=$,_[3]=o):o=_[3];let Q=o;_[4]!==Q?(n=async(e,t)=>{if(!(e.naturalWidth<=0)){try{await e.decode()}catch{}J.current===t&&(q(!0),Q(e))}},_[4]=Q,_[5]=n):n=_[5];let Z=n;_[6]!==Y||_[7]!==Z?(l=()=>{if(!Y)return;J.current=J.current+1;let e=J.current;q(!1);let t=z.current;!t||t.complete&&t.naturalWidth>0&&Z(t,e)},s=[Y,Z],_[6]=Y,_[7]=Z,_[8]=l,_[9]=s):(l=_[8],s=_[9]),i.useEffect(l,s),_[10]!==Z?(h=e=>{Z(e.currentTarget,J.current)},_[10]=Z,_[11]=h):h=_[11];let ee=h;_[12]!==N?(f=()=>{if(N&&z.current)return N(z.current),()=>{N(null)}},d=[N],_[12]=N,_[13]=f,_[14]=d):(f=_[13],d=_[14]),i.useEffect(f,d),_[15]!==k||_[16]!==L||_[17]!==$?(g=()=>{$||(L(null),k(null))},m=[L,k,$],_[15]=k,_[16]=L,_[17]=$,_[18]=g,_[19]=m):(g=_[18],m=_[19]),i.useEffect(g,m),_[20]!==O?(p=e=>{let t=e.currentTarget,r=O?.current,o=t.getBoundingClientRect();if(!o.width||!o.height)return null;if(!r)return{x:Math.min(1,Math.max(0,(e.clientX-o.left)/o.width)),y:1-Math.min(1,Math.max(0,(e.clientY-o.top)/o.height))};let i=x(r).rotation;if(0===i)return{x:Math.min(1,Math.max(0,(e.clientX-o.left)/o.width)),y:1-Math.min(1,Math.max(0,(e.clientY-o.top)/o.height))};let n=o.left+o.width/2,l=o.top+o.height/2,a=e.clientX-n,u=e.clientY-l,s=Math.cos(-i),c=Math.sin(-i);return{x:Math.min(1,Math.max(0,(a*s-u*c)/o.width+.5)),y:1-Math.min(1,Math.max(0,(a*c+u*s)/o.height+.5))}},_[20]=O,_[21]=p):p=_[21];let et=p;_[22]!==j||_[23]!==et||_[24]!==O||_[25]!==X.height||_[26]!==X.width||_[27]!==Y||_[28]!==k||_[29]!==L||_[30]!==$?(w=e=>{if("mouse"!==e.pointerType)return;G.current=!0;let t=et(e);if(t&&(V.current=t),!$)return;let r=e.currentTarget,o=O?.current??r,i=(0,v.getImageSrc)(r)||Y,n=r.naturalWidth||X.width,l=r.naturalHeight||X.height,a=x(o),u=A(o),s=u.width*a.scaleX,c=u.height*a.scaleY,h=S(n,l,s,c),f=T(r),d=r.clientWidth||h.width,g=r.clientHeight||h.height,m=y(o,d*a.scaleX,g*a.scaleY);t&&k(t),L({id:j,src:i,element:o,naturalWidth:n,naturalHeight:l,containerWidth:s||void 0,containerHeight:c||void 0,renderWidth:h.width||void 0,renderHeight:h.height||void 0,fittedWidth:f.width||void 0,fittedHeight:f.height||void 0,sourceRect:m,rotation:a.rotation||void 0})},_[22]=j,_[23]=et,_[24]=O,_[25]=X.height,_[26]=X.width,_[27]=Y,_[28]=k,_[29]=L,_[30]=$,_[31]=w):w=_[31];let er=w;_[32]!==et||_[33]!==k||_[34]!==$?(P=e=>{if("mouse"!==e.pointerType)return;if(!$){let t=et(e);t&&(V.current=t);return}let t=et(e);t&&(V.current=t,k(t))},_[32]=et,_[33]=k,_[34]=$,_[35]=P):P=_[35];let eo=P;_[36]!==k||_[37]!==L||_[38]!==$?(F=e=>{"mouse"!==e.pointerType||(G.current=!1,$&&(L(null),k(null)))},_[36]=k,_[37]=L,_[38]=$,_[39]=F):F=_[39];let ei=F;return _[40]!==j||_[41]!==O||_[42]!==X.height||_[43]!==X.width||_[44]!==Y||_[45]!==k||_[46]!==L||_[47]!==$?(H=()=>{if(!$||!G.current||!z.current)return;let e=V.current;if(!e)return;k(e);let t=z.current,r=O?.current??t,o=x(r),i=A(r),n=i.width*o.scaleX,l=i.height*o.scaleY,a=S(t.naturalWidth||X.width,t.naturalHeight||X.height,n,l),u=T(t),s=t.clientWidth||a.width,c=t.clientHeight||a.height,h=y(r,s*o.scaleX,c*o.scaleY);L({id:j,src:(0,v.getImageSrc)(t)||Y,element:r,naturalWidth:t.naturalWidth||X.width,naturalHeight:t.naturalHeight||X.height,containerWidth:n||void 0,containerHeight:l||void 0,renderWidth:a.width||void 0,renderHeight:a.height||void 0,fittedWidth:u.width||void 0,fittedHeight:u.height||void 0,sourceRect:h,rotation:o.rotation||void 0})},D=[j,O,X.height,X.width,Y,k,L,$],_[40]=j,_[41]=O,_[42]=X.height,_[43]=X.width,_[44]=Y,_[45]=k,_[46]=L,_[47]=$,_[48]=H,_[49]=D):(H=_[48],D=_[49]),i.useEffect(H,D),_[50]!==j||_[51]!==ee||_[52]!==er||_[53]!==ei||_[54]!==eo||_[55]!==Y||_[56]!==K?(C={imageRef:z,imageSrc:Y,effectKey:j,isLoaded:K,onLoad:ee,onPointerEnter:er,onPointerMove:eo,onPointerLeave:ei},_[50]=j,_[51]=ee,_[52]=er,_[53]=ei,_[54]=eo,_[55]=Y,_[56]=K,_[57]=C):C=_[57],C}function I(e){return e.setHoverPointer}function M(e){return e.setHoveredImage}function E(e){return e.matches}function H(e){"false"!==a.env.NEXT_PUBLIC_FULL_SITE_ENABLED&&R.usePaperEffectStore.getState().setHoveredImage(e)}function D(e){"false"!==a.env.NEXT_PUBLIC_FULL_SITE_ENABLED&&R.usePaperEffectStore.getState().setHoverPointer(e)}function C(e){let{activeRenderedImageKey:t,activeRenderedImageMode:r}=(0,R.usePaperEffectStore)((0,n.useShallow)(_));return t===e&&("transition"===r||"hover"===r)}function _(e){return{activeRenderedImageKey:e.activeRenderedImageKey,activeRenderedImageMode:e.activeRenderedImageMode}}function b(e){let o,a,u,s,c,h,f,d,v,g,m,p,w,x,A,S,T=(0,r.c)(65),{enableHover:y,disableTransitionDistortion:F,halftoneColor:I}=e,{transitionData:M,transitionPhase:E,setTransitionPhase:H}=(0,l.usePageTransition)((0,n.useShallow)(U)),{hoveredImage:D,hoverPointer:C,setActiveRenderedImageKey:_,setActiveRenderedImageMode:b,setHoveredImage:N}=(0,R.usePaperEffectStore)((0,n.useShallow)(W)),[O,B]=i.useState(null),L=i.useRef(null),k="IDLE"!==E&&"TRANSITION_COMPLETE"!==E&&!!M,z="TRANSITION_COMPLETE"===E&&!!M?.imageSrc,X=k||z,Y=X?"transition":"hover",j=y?D??O:null,V=X?M?.imageSrc:j?.src;M?.sourceRect;e:{let e;if(X){o=M?.sourceRect;break e}if(!y||!j?.element){o=void 0;break e}if(j.sourceRect){let e,t;T[0]!==j.element?(e=j.element.getBoundingClientRect(),T[0]=j.element,T[1]=e):e=T[1];let r=e,i=r.left+r.width/2,n=r.top+r.height/2,l=i-j.sourceRect.width/2,a=n-j.sourceRect.height/2;T[2]!==j.sourceRect.height||T[3]!==j.sourceRect.width||T[4]!==l||T[5]!==a?(t={left:l,top:a,width:j.sourceRect.width,height:j.sourceRect.height},T[2]=j.sourceRect.height,T[3]=j.sourceRect.width,T[4]=l,T[5]=a,T[6]=t):t=T[6],o=t;break e}if(T[7]!==j){let t,r,o;t=j.element.getBoundingClientRect(),r=j.fittedWidth||j.renderWidth||j.containerWidth||t.width,o=j.fittedHeight||j.renderHeight||j.containerHeight||t.height,e={left:t.left+t.width/2-r/2,top:t.top+t.height/2-o/2,width:r,height:o},T[7]=j,T[8]=e}else e=T[8];o=e}let G=o,K=X?M?.targetRect:void 0,[q,J]=i.useState(!1),$=!!(V&&G),Q=!!("transition"===Y&&K&&V&&G);T[9]!==D?.id||T[10]!==V||T[11]!==M?.imageSrc||T[12]!==M?.itemId?(a=e=>"transition"===e?M?.itemId??M?.imageSrc??V:D?.id??V,T[9]=D?.id,T[10]=V,T[11]=M?.imageSrc,T[12]=M?.itemId,T[13]=a):a=T[13],D?.id,M?.imageSrc,M?.itemId;let Z=a;T[14]!==y||T[15]!==O||T[16]!==D||T[17]!==Y?(u=()=>{if(!y||"hover"!==Y){L.current&&(window.clearTimeout(L.current),L.current=null),B(null);return}if(D){L.current&&(window.clearTimeout(L.current),L.current=null),B(D);return}!O||L.current||(L.current=window.setTimeout(()=>{B(null),L.current=null},240))},s=[y,Y,D,O],T[14]=y,T[15]=O,T[16]=D,T[17]=Y,T[18]=u,T[19]=s):(u=T[18],s=T[19]),i.useEffect(u,s),T[20]===Symbol.for("react.memo_cache_sentinel")?(c=()=>()=>{L.current&&(window.clearTimeout(L.current),L.current=null)},h=[],T[20]=c,T[21]=h):(c=T[20],h=T[21]),i.useEffect(c,h),T[22]!==V||T[23]!==Y||T[24]!==Z||T[25]!==_||T[26]!==b?(f=()=>{if(!V)return;let e=Z(Y);e&&(_(e),b(Y))},T[22]=V,T[23]=Y,T[24]=Z,T[25]=_,T[26]=b,T[27]=f):f=T[27];let ee=f;T[28]!==Y||T[29]!==H||T[30]!==M?(d=()=>{M&&"transition"===Y&&H("CANVAS_ANIMATION_COMPLETE")},T[28]=Y,T[29]=H,T[30]=M,T[31]=d):d=T[31];let et=d,er=i.useRef(Y);T[32]!==Y||T[33]!==N?(g=()=>{"transition"===Y&&"transition"!==er.current&&N(null),er.current=Y},v=[Y,N],T[32]=Y,T[33]=N,T[34]=v,T[35]=g):(v=T[34],g=T[35]),i.useEffect(g,v),T[36]!==y||T[37]!==Y?(m=()=>{"hover"===Y&&y&&J(!1)},p=[y,Y],T[36]=y,T[37]=Y,T[38]=m,T[39]=p):(m=T[38],p=T[39]),i.useEffect(m,p),T[40]!==O||T[41]!==D||T[42]!==Y||T[43]!==_||T[44]!==b?(w=()=>{"hover"!==Y||D||O||(J(!1),_(null),b(null))},x=[Y,D,O,_,b],T[40]=O,T[41]=D,T[42]=Y,T[43]=_,T[44]=b,T[45]=w,T[46]=x):(w=T[45],x=T[46]),i.useEffect(w,x);let eo="hover"===Y&&y&&!q&&j&&G||"transition"===Y&&$,ei="transition"===Y?M?.itemId??V:j?.id??V;return eo?(T[47]!==Q||T[48]!==F||T[49]!==I||T[50]!==et||T[51]!==ee||T[52]!==j?.element||T[53]!==j?.rotation||T[54]!==j?.sourceRect||T[55]!==C||T[56]!==D||T[57]!==V||T[58]!==Y||T[59]!==ei||T[60]!==G||T[61]!==K?(A=V&&G&&(0,t.jsx)(P,{mode:Y,imageSrc:V,sourcePosition:G,targetPosition:K,isTransitionAnimationEnabled:Q,hoverElement:"hover"===Y?j?.element??null:null,hoverSourceRect:"hover"===Y?j?.sourceRect:void 0,hoverPointer:"hover"===Y?C:null,isHoverActive:"hover"===Y&&!!D,hoverRotation:"hover"===Y?j?.rotation:void 0,halftoneColor:I,disableTransitionDistortion:F,onAnimationCompleteAction:et,onCanvasReadyAction:ee},`${Y}-${ei??"unknown"}`),T[47]=Q,T[48]=F,T[49]=I,T[50]=et,T[51]=ee,T[52]=j?.element,T[53]=j?.rotation,T[54]=j?.sourceRect,T[55]=C,T[56]=D,T[57]=V,T[58]=Y,T[59]=ei,T[60]=G,T[61]=K,T[62]=A):A=T[62],T[63]!==A?(S=(0,t.jsx)(i.Suspense,{fallback:null,children:A}),T[63]=A,T[64]=S):S=T[64],S):null}function W(e){return{hoveredImage:e.hoveredImage,hoverPointer:e.hoverPointer,setActiveRenderedImageKey:e.setActiveRenderedImageKey,setActiveRenderedImageMode:e.setActiveRenderedImageMode,setHoveredImage:e.setHoveredImage}}function U(e){return{transitionData:e.transitionData,transitionPhase:e.transitionPhase,setTransitionPhase:e.setTransitionPhase}}function N(e){let c,h,f,d,v,g,m,p,w=(0,r.c)(17),{halftoneColor:P,className:x}=e,A=(0,u.useBreakpoint)(L),S=(0,l.usePageTransition)(B),{setHoveredImage:T,setHoverPointer:y,setActiveRenderedImageKey:F,setActiveRenderedImageMode:I}=(0,R.usePaperEffectStore)((0,n.useShallow)(O));return(w[0]!==F||w[1]!==I||w[2]!==y||w[3]!==T||w[4]!==S?(c=()=>{"IDLE"!==S&&(T(null),y(null),F(null),I(null))},h=[S,T,y,F,I],w[0]=F,w[1]=I,w[2]=y,w[3]=T,w[4]=S,w[5]=c,w[6]=h):(c=w[5],h=w[6]),i.useEffect(c,h),A&&"IDLE"===S)?(w[7]!==x?(f=(0,s.cx)("pointer-events-none fixed inset-0 h-screen w-screen",x),w[7]=x,w[8]=f):f=w[8],w[9]===Symbol.for("react.memo_cache_sentinel")?(d={display:"block",width:"100%",height:"100%",pointerEvents:"none"},v={preserveDrawingBuffer:!1,antialias:!0},g=[1,2],w[9]=d,w[10]=v,w[11]=g):(d=w[9],v=w[10],g=w[11]),w[12]!==P?(m=(0,t.jsx)(o.Canvas,{style:d,gl:v,dpr:g,frameloop:"always",children:(0,t.jsx)(b,{enableHover:"false"!==a.env.NEXT_PUBLIC_FULL_SITE_ENABLED,disableTransitionDistortion:"false"===a.env.NEXT_PUBLIC_FULL_SITE_ENABLED,halftoneColor:P})}),w[12]=P,w[13]=m):m=w[13],w[14]!==f||w[15]!==m?(p=(0,t.jsx)("div",{className:f,children:m}),w[14]=f,w[15]=m,w[16]=p):p=w[16],p):null}function O(e){return{setHoveredImage:e.setHoveredImage,setHoverPointer:e.setHoverPointer,setActiveRenderedImageKey:e.setActiveRenderedImageKey,setActiveRenderedImageMode:e.setActiveRenderedImageMode}}function B(e){return e.slideTransitionPhase}function L(e){return e.matches}e.s(["usePaperHoverImage",()=>F],83055),e.s(["PaperEffect",()=>N,"setHoverPointer",()=>D,"setHoveredImage",()=>H,"useIsImageActiveInPaperEffect",()=>C],52144)}]);