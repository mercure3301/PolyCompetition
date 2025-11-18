#include "geometry.h"
#include <cmath>
#include <glm/glm.hpp>

Geometry generateCube() {
    Geometry cube;
    
    float vertices[] = {
        // 1
        -0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
         0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
         0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
        -0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
        // 2
        -0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
         0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
         0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
        -0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
        // 3
        -0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,
        -0.5f, -0.5f,  0.5f, -1.0f,  0.0f,  0.0f,
        -0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,
        -0.5f,  0.5f, -0.5f, -1.0f,  0.0f,  0.0f,
        // 4
         0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,
         0.5f, -0.5f,  0.5f,  1.0f,  0.0f,  0.0f,
         0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,
         0.5f,  0.5f, -0.5f,  1.0f,  0.0f,  0.0f,
        // 5
        -0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,
         0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,
         0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,
        -0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,
        // 6
        -0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,
         0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,
         0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,
        -0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,
    };
    
    unsigned int indices[] = {
        // 1
        0, 1, 2,  2, 3, 0,
        // 2
        4, 5, 6,  6, 7, 4,
        // 3
        8, 9, 10,  10, 11, 8,
        // 4
        12, 13, 14,  14, 15, 12,
        // 5
        16, 17, 18,  18, 19, 16,
        // 6
        20, 21, 22,  22, 23, 20
    };
    
    cube.vertices.assign(vertices, vertices + sizeof(vertices) / sizeof(float));
    cube.indices.assign(indices, indices + sizeof(indices) / sizeof(unsigned int));
    
    return cube;
}

Geometry generateSphere(int segments, int rings) {
    Geometry sphere;
    
    const float PI = 3.14159265359f;
    const float radius = 0.5f;
    
    for (int i = 0; i <= rings; ++i) {
        float theta = i * PI / rings;
        float sinTheta = sin(theta);
        float cosTheta = cos(theta);
        
        for (int j = 0; j <= segments; ++j) {
            float phi = j * 2.0f * PI / segments;
            float sinPhi = sin(phi);
            float cosPhi = cos(phi);
            
            float x = radius * sinTheta * cosPhi;
            float y = radius * cosTheta;
            float z = radius * sinTheta * sinPhi;

            sphere.vertices.push_back(x);
            sphere.vertices.push_back(y);
            sphere.vertices.push_back(z);
            sphere.vertices.push_back(x / radius);
            sphere.vertices.push_back(y / radius);
            sphere.vertices.push_back(z / radius);
        }
    }
    
    for (int i = 0; i < rings; ++i) {
        for (int j = 0; j < segments; ++j) {
            int first = i * (segments + 1) + j;
            int second = first + segments + 1;
            
            sphere.indices.push_back(first);
            sphere.indices.push_back(second);
            sphere.indices.push_back(first + 1);
            
            sphere.indices.push_back(second);
            sphere.indices.push_back(second + 1);
            sphere.indices.push_back(first + 1);
        }
    }
    
    return sphere;
}

Geometry generateHexagonalPrism(int segments) {
    Geometry prism;
    
    const float PI = 3.14159265359f;
    const float radius = 0.5f;
    const float height = 1.0f;
    
    std::vector<glm::vec3> topVertices;
    std::vector<glm::vec3> bottomVertices;
    
    for (int i = 0; i < 6; ++i) {
        float angle = i * 2.0f * PI / 6.0f;
        float x = radius * cos(angle);
        float z = radius * sin(angle);
        
        topVertices.push_back(glm::vec3(x, height / 2.0f, z));
        bottomVertices.push_back(glm::vec3(x, -height / 2.0f, z));
    }
    
    glm::vec3 topCenter(0.0f, height / 2.0f, 0.0f);
    glm::vec3 bottomCenter(0.0f, -height / 2.0f, 0.0f);
    
    for (int i = 0; i < 6; ++i) {
        int next = (i + 1) % 6;
        
        prism.vertices.push_back(topCenter.x);
        prism.vertices.push_back(topCenter.y);
        prism.vertices.push_back(topCenter.z);
        prism.vertices.push_back(0.0f);
        prism.vertices.push_back(1.0f);
        prism.vertices.push_back(0.0f);
        
        prism.vertices.push_back(topVertices[i].x);
        prism.vertices.push_back(topVertices[i].y);
        prism.vertices.push_back(topVertices[i].z);
        prism.vertices.push_back(0.0f);
        prism.vertices.push_back(1.0f);
        prism.vertices.push_back(0.0f);
        
        prism.vertices.push_back(topVertices[next].x);
        prism.vertices.push_back(topVertices[next].y);
        prism.vertices.push_back(topVertices[next].z);
        prism.vertices.push_back(0.0f);
        prism.vertices.push_back(1.0f);
        prism.vertices.push_back(0.0f);
    }
    
    for (int i = 0; i < 6; ++i) {
        int next = (i + 1) % 6;
        
        prism.vertices.push_back(bottomCenter.x);
        prism.vertices.push_back(bottomCenter.y);
        prism.vertices.push_back(bottomCenter.z);
        prism.vertices.push_back(0.0f);
        prism.vertices.push_back(-1.0f);
        prism.vertices.push_back(0.0f);
        
        prism.vertices.push_back(bottomVertices[next].x);
        prism.vertices.push_back(bottomVertices[next].y);
        prism.vertices.push_back(bottomVertices[next].z);
        prism.vertices.push_back(0.0f);
        prism.vertices.push_back(-1.0f);
        prism.vertices.push_back(0.0f);
        
        prism.vertices.push_back(bottomVertices[i].x);
        prism.vertices.push_back(bottomVertices[i].y);
        prism.vertices.push_back(bottomVertices[i].z);
        prism.vertices.push_back(0.0f);
        prism.vertices.push_back(-1.0f);
        prism.vertices.push_back(0.0f);
    }
    
    unsigned int baseIndex = 18;
    for (int i = 0; i < 6; ++i) {
        int next = (i + 1) % 6;
        
        glm::vec3 v1 = topVertices[next] - topVertices[i];
        glm::vec3 v2 = topVertices[i] - bottomVertices[i];
        glm::vec3 normal = glm::normalize(glm::cross(v1, v2));
        
        prism.vertices.push_back(topVertices[i].x);
        prism.vertices.push_back(topVertices[i].y);
        prism.vertices.push_back(topVertices[i].z);
        prism.vertices.push_back(normal.x);
        prism.vertices.push_back(normal.y);
        prism.vertices.push_back(normal.z);
        
        prism.vertices.push_back(topVertices[next].x);
        prism.vertices.push_back(topVertices[next].y);
        prism.vertices.push_back(topVertices[next].z);
        prism.vertices.push_back(normal.x);
        prism.vertices.push_back(normal.y);
        prism.vertices.push_back(normal.z);
        
        prism.vertices.push_back(bottomVertices[next].x);
        prism.vertices.push_back(bottomVertices[next].y);
        prism.vertices.push_back(bottomVertices[next].z);
        prism.vertices.push_back(normal.x);
        prism.vertices.push_back(normal.y);
        prism.vertices.push_back(normal.z);
        
        prism.vertices.push_back(bottomVertices[i].x);
        prism.vertices.push_back(bottomVertices[i].y);
        prism.vertices.push_back(bottomVertices[i].z);
        prism.vertices.push_back(normal.x);
        prism.vertices.push_back(normal.y);
        prism.vertices.push_back(normal.z);
    }
    
    for (int i = 0; i < 6; ++i) {
        prism.indices.push_back(i * 3);
        prism.indices.push_back(i * 3 + 1);
        prism.indices.push_back(i * 3 + 2);
    }
    
    for (int i = 0; i < 6; ++i) {
        prism.indices.push_back(18 + i * 3);
        prism.indices.push_back(18 + i * 3 + 1);
        prism.indices.push_back(18 + i * 3 + 2);
    }
    
    baseIndex = 36;
    for (int i = 0; i < 6; ++i) {
        unsigned int offset = baseIndex + i * 4;
        prism.indices.push_back(offset);
        prism.indices.push_back(offset + 1);
        prism.indices.push_back(offset + 2);
        prism.indices.push_back(offset);
        prism.indices.push_back(offset + 2);
        prism.indices.push_back(offset + 3);
    }
    
    return prism;
}




