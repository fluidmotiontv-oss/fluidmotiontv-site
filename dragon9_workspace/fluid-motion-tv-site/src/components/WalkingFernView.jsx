import React, { useEffect, useRef } from 'react';
import { WalkingFernScene } from './WalkingFernScene.js';

export default function WalkingFernView() {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);

    useEffect(() => {
        const currentContainer = containerRef.current;

        if (currentContainer && !sceneRef.current) {
            sceneRef.current = new WalkingFernScene(currentContainer);
        }

        return () => {
            if (sceneRef.current) {
                if (sceneRef.current.renderer) {
                    sceneRef.current.renderer.dispose();
                }
                if (currentContainer) {
                    currentContainer.innerHTML = '';
                }
                sceneRef.current = null;
            }
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            style={{ 
                width: '100vw', 
                height: '100vh', 
                position: 'relative', 
                overflow: 'hidden',
                backgroundColor: '#05080a'
            }} 
        />
    );
}
