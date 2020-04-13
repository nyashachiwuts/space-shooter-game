import { List } from 'immutable'
import gameConfig from 'configs/gameConfig'
import spriteConfig from 'configs/spriteConfig'
import AudioManager from 'core/createAudioManager'
import createPlayer from 'entities/createPlayer'
import UI from 'scenes/UI'
import audioConfig from 'configs/audioConfig'
import canListen from 'components/events/canListen'
import isScene from 'components/isScene'
import createState from 'utils/createState'
import { center } from 'utils/align'

/**
 * Responsible for delegating the various levels, holding the various core systems and such.
 */
const Game = function GameFunc() {
  const state: any = {}
  let audioManager
  let entities = List([])
  let UIScene
  let background: Phaser.GameObjects.Sprite
  let stars: Phaser.GameObjects.Sprite
  let planetCluster: Phaser.GameObjects.Image
  let planet: Phaser.GameObjects.Image
  let planet2: Phaser.GameObjects.Image

  function createBackground () {
    const scene: Phaser.Scene = state.getScene()
    const { add, game } = scene
    const { VIEWHEIGHT, VIEWWIDTH } = gameConfig.GAME
    // background
    background = add.sprite(0, 0, spriteConfig.BACKGROUND.KEY)
    background.setDisplaySize(VIEWWIDTH, VIEWHEIGHT)
    background.setOrigin(0, 0)
    // stars
    stars = add.sprite(0, 0, spriteConfig.STARS.KEY)
    stars.setDisplaySize(VIEWWIDTH, VIEWWIDTH)
    center(stars, game.config)
    // planet cluster
    planetCluster = add.image(0, 0, spriteConfig.PLANET_CLUSTER.KEY)
    center(planetCluster, game.config)
    // planet 1
    planet = add.image(200, 150, spriteConfig.PLANET.KEY)
    // planet 2
    planet2 = add.image(350, 550, spriteConfig.PLANET2.KEY)
  }

  function createCoin() {
    audioManager.playSfx(audioConfig.SFX.COIN.KEY)
  }

  function cameraSetup() {
    state.getScene().cameras.main.setViewport(0, 0, gameConfig.GAME.VIEWWIDTH, gameConfig.GAME.VIEWHEIGHT)
    state.getScene().cameras.main.setZoom(0.8)
  }

  function addEntities() {
    const numberOfEntities = 3

    for (let i = 0; i < numberOfEntities; i += 1) {
      entities = entities.push(createPlayer())
    }

    // Log a player entity example, same as in readme.md
    console.log(entities.get(0))
    entities.forEach((e) => {
      e.printInfo()
    })
  }

  function init() {
    // After assets are loaded.
    UIScene = UI()
    state.getScene().scene.add(gameConfig.SCENES.UI, UIScene.getScene(), true)
    audioManager = AudioManager(UIScene.getScene())
  }

  function create() {
    audioManager.playMusic()
    createBackground()
    createCoin()
    addEntities()
    cameraSetup()
  }

  function update(time, delta) { }

  function destroy() {
    if (background) state.getScene().background.destroy()
    if (UI) UI.destroy()
  }

  const localState = {
    // props
    // methods
    init,
    create,
    update,
    destroy,
  }

  return createState('Game', state, {
    localState,
    canListen: canListen(state),
    isScene: isScene(state, gameConfig.SCENES.GAME),
  })
}

export default Game
