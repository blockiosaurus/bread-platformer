'use client';
import React, { useEffect } from 'react'
import { GameClass } from '@/game';
import { GameConfig } from '@/game/config';

const Game = () => {
    useEffect(() => {
        // const config = {
        //   type: Phaser.AUTO,
        //   pixelArt: true,
        //   render: {
        //     pixelArt: true,
        //   },
        //   width: window.innerWidth,
        //   height: window.innerHeight,
        //   scale: {
        //     mode: Phaser.Scale.RESIZE,
        //     autoRound: true,
        //   },
        
        //   physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
        //   scene: [Example],
        // };
        // const game = new Phaser.Game(config)
        const game = new GameClass(GameConfig);
        return () => {
          game.destroy(true)
        }
      },[])
  return (
    <div>

    </div>
  )
}


export default Game;