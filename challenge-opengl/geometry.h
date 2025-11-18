#ifndef GEOMETRY_H
#define GEOMETRY_H

#include <vector>

struct Geometry {
    std::vector<float> vertices;
    std::vector<unsigned int> indices;
};

Geometry generateCube();
Geometry generateSphere(int segments, int rings);
Geometry generateHexagonalPrism(int segments);

#endif




