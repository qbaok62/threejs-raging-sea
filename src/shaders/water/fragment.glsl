uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

uniform vec3 uFoamColor;

varying float vElevation;
varying float vSmallElevation;

#include <fog_pars_fragment>

void main() {
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    vec3 withFoam = mix(color, uFoamColor, vSmallElevation);

    gl_FragColor = vec4(withFoam, 1.0);
    #include <colorspace_fragment>
    #include <fog_fragment>
}