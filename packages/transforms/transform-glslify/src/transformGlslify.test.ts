import { transformGlslify } from './transformGlslify'

test('basic', async () => {
  const api = {}
  const options = {}
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `#ifdef GL_ES
precision highp float;
#endif

// shader attributes
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;
attribute float aFace;

// shader uniforms
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying vec4 vPosition;
varying float vFace;

void main(void) {
  vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
  gl_Position = uPMatrix * vPosition;
  vTextureCoord = aTextureCoord;
  vTransformedNormal = uNMatrix * aVertexNormal;
  vFace = aFace;
}`,
    },
  }
  const transformed = await transformGlslify(api, options)(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: `#ifdef GL_ES
precision highp float;
#define GLSLIFY 1
#endif
attribute vec3 aVertexPosition;attribute vec3 aVertexNormal;attribute vec2 aTextureCoord;attribute float aFace;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;uniform mat3 uNMatrix;varying vec2 vTextureCoord;varying vec3 vTransformedNormal;varying vec4 vPosition;varying float vFace;void main(void){vPosition=uMVMatrix*vec4(aVertexPosition,1.0);gl_Position=uPMatrix*vPosition;vTextureCoord=aTextureCoord;vTransformedNormal=uNMatrix*aVertexNormal;vFace=aFace;}`,
    },
  })
})
