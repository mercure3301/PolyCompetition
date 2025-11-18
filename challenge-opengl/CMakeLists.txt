cmake_minimum_required(VERSION 3.10)
project(OpenGL3DObjects)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_library(GLFW3_LIBRARY 
    NAMES glfw3 glfw
    PATHS 
    /usr/lib 
    /usr/local/lib 
    /usr/lib/x86_64-linux-gnu
)
find_path(GLFW3_INCLUDE_DIR 
    GLFW/glfw3.h
    PATHS 
    /usr/include 
    /usr/local/include
)

if(GLFW3_LIBRARY AND GLFW3_INCLUDE_DIR)
    set(GLFW3_LIBRARIES ${GLFW3_LIBRARY})
    message(STATUS "Found GLFW")
    message(STATUS "GLFW Include: ${GLFW3_INCLUDE_DIR}")
else()
    message(FATAL_ERROR "GLFW3 not found")
endif()

find_path(GLM_INCLUDE_DIR glm/glm.hpp
    PATHS
    /usr/include
    /usr/local/include
    ${CMAKE_SOURCE_DIR}/include
)

if(GLM_INCLUDE_DIR)
    include_directories(${GLM_INCLUDE_DIR})
else()
    message(WARNING "GLM not found")
endif()

find_path(GLAD_INCLUDE_DIR glad/glad.h
    PATHS
    ${CMAKE_SOURCE_DIR}/include
    /usr/include
    /usr/local/include
)

find_file(GLAD_SOURCE glad.c
    PATHS
    ${CMAKE_SOURCE_DIR}/src
    ${CMAKE_SOURCE_DIR}
)

if(GLAD_INCLUDE_DIR)
    include_directories(${GLAD_INCLUDE_DIR})
    if(GLAD_SOURCE)
        message(STATUS "Using GLAD from ${GLAD_SOURCE}")
    else()
        message(STATUS "Using system GLAD")
    endif()
else()
    message(FATAL_ERROR "GLAD not found")
endif()

include_directories(${GLFW3_INCLUDE_DIR})

set(SOURCES
    main.cpp
    shader.cpp
    camera.cpp
    geometry.cpp
)

if(GLAD_SOURCE)
    list(APPEND SOURCES ${GLAD_SOURCE})
endif()

add_executable(${PROJECT_NAME} ${SOURCES})

target_link_libraries(${PROJECT_NAME} 
    ${GLFW3_LIBRARIES}
    GL
    X11
    pthread
    dl
    m
)

file(COPY ${CMAKE_SOURCE_DIR}/shaders DESTINATION ${CMAKE_BINARY_DIR})

