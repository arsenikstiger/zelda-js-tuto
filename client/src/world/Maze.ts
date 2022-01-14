import LayerObject from "../models/LayerObject.js";
import LevelData from "../models/LevelData.js";
import ObjectGroupLayer from "../models/ObjectGroupLayer.js";
import Rectangle from "../models/Rectangle.js";
import TileLayer from "../models/TileLayer.js";

export default class Maze {
  public width: number;
  public height: number;
  public startX: number;
  public startY: number;
  public endX: number;
  public endY: number;

  protected current: Cell;
  protected cells: Cell[][];
  protected visited: Set<Cell>;
  protected frontier: Set<Cell>;

  public constructor(
    width: number,
    height: number,
    startX: number,
    startY: number,
    endX: number,
    endY: number,    
  ) {
    this.width = width;
    this.height = height;
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
  }

  public generate(): void {
    // Algorithme de Prim - Arbre couvrant
    this.cells = [];
    this.visited = new Set();
    this.frontier = new Set();

    // Generate grid template
    for (let y = 0; y < this.height; y++) {
      // Step 1: Initialize empty row
      this.cells[y] = [];
      // width = y+1;
      for (let x = 0; x < this.width; x++) {
        // Step 2: create each cell in this row
        const cell: Cell = {
          x: x,
          y: y,
          topWall: true,
          bottomWall: true,
          leftWall: true,
          rightWall: true,
          index: [x, y],
          status: "unvisited",
          adjacents: [],
          connections: [],
        };
        this.cells[y][x] = cell;
        // add to unvisited set
        // unvisited.add(cell);
        // add adjacents
        if (this.cells[y - 1]) {
          if (this.cells[y - 1][x]) {
            const up = this.cells[y - 1][x];
            cell.adjacents.push(up);
            up.adjacents.push(cell);
          }
        }
        if (this.cells[y][x - 1]) {
          const left = this.cells[y][x - 1];
          cell.adjacents.push(left);
          left.adjacents.push(cell);
        }
      }
    }

    // get starting point and add it to visited set
    const start = this.cells[this.startY][this.startX];

    // Initialize starting cell as frontier
    this.frontier.add(start);

    // Set start as current
    this.current = start;

    this.recursiveSpanningTree();
  }

  public toJson(): string {
    let id = 0;
    const levelData = new LevelData();

    // Create level
    {
      levelData.compressionlevel = 1;
      levelData.type = "map";
      levelData.type = "1.6";
      levelData.width = this.width * 3;
      levelData.height = this.height * 3;
      levelData.infinite = false;
      levelData.orientation = "orthogonal";
      levelData.renderorder = "right-down";
      levelData.tiledversion = "1.7.2";
      levelData.tilewidth = 16;
      levelData.tileheight = 16;
      levelData.tilesets = [
        {
          firstgid: 1,
          source: "../spritesheets/outside.json",
        },
      ];
      levelData.layers = [];
    }

    // Add background
    {
      const backgroundLayer = new TileLayer();
      backgroundLayer.id = id++;
      backgroundLayer.type = "tilelayer";
      backgroundLayer.name = "background";
      backgroundLayer.width = this.width * 3;
      backgroundLayer.height = this.height * 3;
      backgroundLayer.opacity = 1;
      backgroundLayer.visible = true;
      backgroundLayer.x = 0;
      backgroundLayer.y = 0;
      backgroundLayer.data = [];

      // On remplit d'herbe le background
      for (let n = 0; n < backgroundLayer.width * backgroundLayer.height; n++) {
        const random = Math.random() * 100;
        if (random < 80) backgroundLayer.data[n] = 18;
        // 80% herbe
        else if (random < 94) backgroundLayer.data[n] = 27;
        // 14% herbe haute
        else if (random < 99) backgroundLayer.data[n] = 36;
        // 5% fleurs
        else backgroundLayer.data[n] = 9; // 1% cailloux
      }

      levelData.layers.push(backgroundLayer);
    }

    // Add foreground
    {
      const foregroundLayer = new TileLayer();
      foregroundLayer.id = id++;
      foregroundLayer.type = "tilelayer";
      foregroundLayer.name = "walls";
      foregroundLayer.width = this.width * 3;
      foregroundLayer.height = this.height * 3;
      foregroundLayer.opacity = 1;
      foregroundLayer.visible = true;
      foregroundLayer.x = 0;
      foregroundLayer.y = 0;
      foregroundLayer.data = [];
      // On remplit de vide le foreground
      for (let n = 0; n < foregroundLayer.width * foregroundLayer.height; n++) {
        foregroundLayer.data[n] = 0; // vide
      }
      // On dessine les murs
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const cell = this.cells[y][x];

          const _x = x * 3;
          const _y = y * 3;
          const _width = foregroundLayer.width;

          if (cell.topWall) {
            // Mur Haut/Gauche ?
            foregroundLayer.data[_y * _width + _x] = cell.leftWall
              ? 23 // Coin haut gauche
              : 21; // Mur haut

            foregroundLayer.data[_y * _width + _x + 1] = 21; // Mur haut

            // Mur Haut/Droite
            foregroundLayer.data[_y * _width + _x + 2] = cell.rightWall
              ? 19 // Coin haut droite
              : 21; // Mur haut
          } else {
            foregroundLayer.data[_y * _width + _x] = cell.leftWall ? 13 : 22;
            foregroundLayer.data[_y * _width + _x + 2] = cell.rightWall
              ? 11
              : 20;
          }

          if (cell.bottomWall) {
            // Mur Bas/Gauche ?
            foregroundLayer.data[(_y + 2) * _width + _x] = cell.leftWall
              ? 5 // Coin bas gauche
              : 3; // Mur bas

            // Mur Bas
            foregroundLayer.data[(_y + 2) * _width + _x + 1] = 3;

            // Mur Bas/Droite
            foregroundLayer.data[(_y + 2) * _width + _x + 2] = cell.rightWall
              ? 1 // Coin bas droite
              : 3; // Mur bas
          } else {
            foregroundLayer.data[(_y + 2) * _width + _x] = cell.leftWall
              ? 13
              : 4;
            foregroundLayer.data[(_y + 2) * _width + _x + 2] = cell.rightWall
              ? 11
              : 2;
          }

          // Mur Gauche
          if (cell.leftWall) {
            // Mur gauche
            foregroundLayer.data[(_y + 1) * _width + _x] = 13;
          }

          // Mur Droite
          if (cell.rightWall) {
            // Mur droite
            foregroundLayer.data[(_y + 1) * _width + _x + 2] = 11;
          }
        }
      }
      levelData.layers.push(foregroundLayer);
    }

    // Add collisions
    {
      const collisionLayer = new ObjectGroupLayer();
      collisionLayer.id = id++;
      collisionLayer.name = "collisions";
      collisionLayer.type = "objectgroup";
      collisionLayer.opacity = 1;
      collisionLayer.visible = true;
      collisionLayer.x = 0;
      collisionLayer.y = 0;
      collisionLayer.draworder = "topdown";
      collisionLayer.objects = [];
      // On calcule les collisions
      let collisionRectangles: Rectangle[] = [];
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const cell = this.cells[y][x];

          const _x = x * 3;
          const _y = y * 3;

          // Mur Haut
          if (cell.topWall) {
            collisionRectangles.push(new Rectangle(_x * 16, _y * 16, 16, 16));
            collisionRectangles.push(
              new Rectangle((_x + 1) * 16, _y * 16, 16, 16)
            );
            collisionRectangles.push(
              new Rectangle((_x + 2) * 16, _y * 16, 16, 16)
            );
          } else {
            if (!cell.leftWall) {
              collisionRectangles.push(new Rectangle(_x * 16, _y * 16, 16, 16));
            }

            if (!cell.rightWall) {
              collisionRectangles.push(
                new Rectangle((_x + 2) * 16, _y * 16, 16, 16)
              );
            }
          }

          // Mur Bas
          if (cell.bottomWall) {
            collisionRectangles.push(
              new Rectangle(_x * 16, (_y + 2) * 16, 16, 16)
            );
            collisionRectangles.push(
              new Rectangle((_x + 1) * 16, (_y + 2) * 16, 16, 16)
            );
            collisionRectangles.push(
              new Rectangle((_x + 2) * 16, (_y + 2) * 16, 16, 16)
            );
          } else {
            if (!cell.leftWall) {
              collisionRectangles.push(
                new Rectangle(_x * 16, (_y + 2) * 16, 16, 16)
              );
            }

            if (!cell.rightWall) {
              collisionRectangles.push(
                new Rectangle((_x + 2) * 16, (_y + 2) * 16, 16, 16)
              );
            }
          }

          // Mur Gauche
          if (cell.leftWall) {
            if (!cell.topWall)
              collisionRectangles.push(new Rectangle(_x * 16, _y * 16, 16, 16));
            collisionRectangles.push(
              new Rectangle(_x * 16, (_y + 1) * 16, 16, 16)
            );
            if (!cell.bottomWall)
              collisionRectangles.push(
                new Rectangle(_x * 16, (_y + 2) * 16, 16, 16)
              );
          }

          // Mur Droite
          if (cell.rightWall) {
            if (!cell.topWall)
              collisionRectangles.push(
                new Rectangle((_x + 2) * 16, _y * 16, 16, 16)
              );
            collisionRectangles.push(
              new Rectangle((_x + 2) * 16, (_y + 1) * 16, 16, 16)
            );
            if (!cell.bottomWall)
              collisionRectangles.push(
                new Rectangle((_x + 2) * 16, (_y + 2) * 16, 16, 16)
              );
          }
        }
      }

      // On fusionne les collisions horizontales
      let optimizedRectangles: Rectangle[] = [];
      for (let i = 0; i < collisionRectangles.length; i++) {
        const cr = collisionRectangles[i];
        let handled = false;
        // On recherche parmi les rectangles un qui a les mêmes bords
        for (let x = 0; x < optimizedRectangles.length; x++) {
          const or = optimizedRectangles[x];
          if (or.y !== cr.y) continue;
          if (or.height !== cr.height) continue;
          // Deux rectangles adjacents
          if (or.x + or.width !== cr.x) continue;
          // Si les rectangles se touchent, on les fusionnent
          or.width = or.width + cr.width;
          handled = true;
          break;
        }
        // Si on n'en a pas trouvé, alors on rajoute l'actuel
        if (!handled) {
          optimizedRectangles.push(cr);
        }
      }
      collisionRectangles = optimizedRectangles;

      // On fusionne les collisions verticales
      optimizedRectangles = [];
      for (let i = 0; i < collisionRectangles.length; i++) {
        const cr = collisionRectangles[i];
        let handled = false;
        // On recherche parmi les rectangles un qui a les mêmes bords
        for (let x = 0; x < optimizedRectangles.length; x++) {
          const or = optimizedRectangles[x];
          if (or.x !== cr.x) continue;
          if (or.width !== cr.width) continue;
          if (or.y + or.height !== cr.y) continue;
          // Si les rectngles se touchent, on les fusionnent
          or.height = or.height + cr.height;
          handled = true;
          break;
        }
        // Si on n'en a pas trouvé, alors on rajoute l'actuel
        if (!handled) {
          optimizedRectangles.push(cr);
        }
      }
      collisionRectangles = optimizedRectangles;

      // On ajoute la partie collisions au json
      for (let i = 0; i < collisionRectangles.length; i++) {
        const collisionRectangle = collisionRectangles[i];
        const layerObject = new LayerObject();
        layerObject.id = id++;
        layerObject.type = "Static";
        layerObject.name = "";
        layerObject.x = collisionRectangle.x;
        layerObject.y = collisionRectangle.y;
        layerObject.width = collisionRectangle.width - 1;
        layerObject.height = collisionRectangle.height - 1;
        layerObject.rotation = 0;
        layerObject.visible = true;
        collisionLayer.objects.push(layerObject);
      }

      levelData.layers.push(collisionLayer);
    }

    // Add horizontal pathways
    {
      const horizontalPathwayLayer = new ObjectGroupLayer();
      horizontalPathwayLayer.id = id++;
      horizontalPathwayLayer.name = "horizontalpathways";
      horizontalPathwayLayer.type = "objectgroup";
      horizontalPathwayLayer.opacity = 1;
      horizontalPathwayLayer.visible = true;
      horizontalPathwayLayer.x = 0;
      horizontalPathwayLayer.y = 0;
      horizontalPathwayLayer.draworder = "topdown";
      horizontalPathwayLayer.objects = [];

      // Precalculate pathways
      const pathwayRectangles: Rectangle[] = [];
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const cell = this.cells[y][x];

          const _x = x * 3;
          const _y = y * 3;

          // Pas de mur Haut
          if (!cell.topWall) {
            pathwayRectangles.push(
              new Rectangle((_x + 1) * 16, _y * 16, 16, 16)
            );
          }

          // Pas de mur Gauche
          if (!cell.leftWall) {
            pathwayRectangles.push(
              new Rectangle(_x * 16, (_y + 1) * 16, 16, 16)
            );
          }

          // Cellule centrale
          pathwayRectangles.push(
            new Rectangle((_x + 1) * 16, (_y + 1) * 16, 16, 16)
          );

          // Pas de mur Bas
          if (!cell.bottomWall) {
            pathwayRectangles.push(
              new Rectangle((_x + 1) * 16, (_y + 2) * 16, 16, 16)
            );
          }

          // Pas de mur Droite
          if (!cell.rightWall) {
            pathwayRectangles.push(
              new Rectangle((_x + 2) * 16, (_y + 1) * 16, 16, 16)
            );
          }
        }
      }

      // On fusionne les chemins horizontaux
      const horizontalRectangles: Rectangle[] = [];
      for (let i = 0; i < pathwayRectangles.length; i++) {
        const pr = pathwayRectangles[i];

        let handled = false;
        // On recherche parmi les rectangles un qui a les mêmes bords
        for (let x = 0; x < horizontalRectangles.length; x++) {
          const hr = horizontalRectangles[x];

          if (hr.y !== pr.y) continue;
          if (hr.height !== pr.height) continue;
          // Deux rectangles adjacents
          if (hr.x + hr.width !== pr.x) continue;
          // Si les rectangles se touchent, on les fusionnent

          hr.width = hr.width + pr.width;
          handled = true;
          break;
        }
        // Si on n'en a pas trouvé, alors on rajoute l'actuel
        if (!handled) {
          horizontalRectangles.push(pr);
        }
      }

      // On ajoute les chemins horizontaux de plus d'une case au json
      for (let i = 0; i < horizontalRectangles.length; i++) {
        const pathwayRectangle = horizontalRectangles[i];
        if (pathwayRectangle.width === 16) continue;
        const layerObject = new LayerObject();
        layerObject.id = id++;
        layerObject.type = "Static";
        layerObject.name = "";
        layerObject.x = pathwayRectangle.x;
        layerObject.y = pathwayRectangle.y;
        layerObject.width = pathwayRectangle.width; // -1;
        layerObject.height = pathwayRectangle.height; // - 1;
        layerObject.rotation = 0;
        layerObject.visible = true;
        horizontalPathwayLayer.objects.push(layerObject);
      }

      levelData.layers.push(horizontalPathwayLayer);
    }

    // Add vertical pathways
    {
      const verticalPathwayLayer = new ObjectGroupLayer();
      verticalPathwayLayer.id = id++;
      verticalPathwayLayer.name = "verticalpathways";
      verticalPathwayLayer.type = "objectgroup";
      verticalPathwayLayer.opacity = 1;
      verticalPathwayLayer.visible = true;
      verticalPathwayLayer.x = 0;
      verticalPathwayLayer.y = 0;
      verticalPathwayLayer.draworder = "topdown";
      verticalPathwayLayer.objects = [];

      // Precalculate pathways
      const pathwayRectangles: Rectangle[] = [];
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const cell = this.cells[y][x];

          const _x = x * 3;
          const _y = y * 3;

          // Pas de mur Haut
          if (!cell.topWall) {
            pathwayRectangles.push(
              new Rectangle((_x + 1) * 16, _y * 16, 16, 16)
            );
          }

          // Pas de mur Gauche
          if (!cell.leftWall) {
            pathwayRectangles.push(
              new Rectangle(_x * 16, (_y + 1) * 16, 16, 16)
            );
          }

          // Cellule centrale
          pathwayRectangles.push(
            new Rectangle((_x + 1) * 16, (_y + 1) * 16, 16, 16)
          );

          // Pas de mur Bas
          if (!cell.bottomWall) {
            pathwayRectangles.push(
              new Rectangle((_x + 1) * 16, (_y + 2) * 16, 16, 16)
            );
          }

          // Pas de mur Droite
          if (!cell.rightWall) {
            pathwayRectangles.push(
              new Rectangle((_x + 2) * 16, (_y + 1) * 16, 16, 16)
            );
          }
        }
      }

      // On fusionne les chemins verticaux
      const verticalRectangles = [];
      for (let i = 0; i < pathwayRectangles.length; i++) {
        const pr = pathwayRectangles[i];
        let handled = false;
        // On recherche parmi les rectangles un qui a les mêmes bords
        for (let x = 0; x < verticalRectangles.length; x++) {
          const hr = verticalRectangles[x];
          if (hr.x !== pr.x) continue;
          if (hr.width !== pr.width) continue;
          if (hr.y + hr.height !== pr.y) continue;
          // Si les rectngles se touchent, on les fusionnent
          hr.height = hr.height + pr.height;
          handled = true;
          break;
        }
        // Si on n'en a pas trouvé, alors on rajoute l'actuel
        if (!handled) {
          verticalRectangles.push(pr);
        }
      }

      // On ajoute les chemins verticaux au json
      for (let i = 0; i < verticalRectangles.length; i++) {
        const pathwayRectangle = verticalRectangles[i];
        if (pathwayRectangle.height === 16) continue;
        const layerObject = new LayerObject();
        layerObject.id = id++;
        layerObject.type = "Static";
        layerObject.name = "";
        layerObject.x = pathwayRectangle.x;
        layerObject.y = pathwayRectangle.y;
        layerObject.width = pathwayRectangle.width - 1;
        layerObject.height = pathwayRectangle.height - 1;
        layerObject.rotation = 0;
        layerObject.visible = true;
        verticalPathwayLayer.objects.push(layerObject);
      }

      levelData.layers.push(verticalPathwayLayer);
    }

    // Add positions
    {
      const positionsLayer = new ObjectGroupLayer();
      positionsLayer.id = id++;
      positionsLayer.name = "positions";
      positionsLayer.type = "objectgroup";
      positionsLayer.opacity = 1;
      positionsLayer.visible = true;
      positionsLayer.x = this.startX;
      positionsLayer.y = this.startY;
      positionsLayer.draworder = "topdown";
      positionsLayer.objects = [];

      // Add start position
      const startPosition = new LayerObject();
      startPosition.id = id++;
      startPosition.type = "Start";
      startPosition.name = "Player";
      startPosition.point = true;
      startPosition.x = ((this.startX * 3) + 1) * 16;
      startPosition.y = ((this.startY * 3) + 1) * 16;
      startPosition.width = 0;
      startPosition.height = 0;
      startPosition.rotation = 0;
      startPosition.visible = true;
      positionsLayer.objects.push(startPosition);

      // Add end position
      const endPosition = new LayerObject();
      endPosition.id = id++;
      endPosition.type = "End";
      endPosition.name = "Licorn";
      endPosition.point = true;
      endPosition.x = (this.endX * 3 + 1) * 16;
      endPosition.y = ((this.endY * 3) + 1) * 16;
      endPosition.width = 0;
      endPosition.height = 0;
      endPosition.rotation = 0;
      endPosition.visible = true;
      positionsLayer.objects.push(endPosition);

      levelData.layers.push(positionsLayer);
    }

    const json = JSON.stringify(levelData);
    console.log(json);
    return json;
  }

  protected recursiveSpanningTree(): void {
    // remove current from frontier and add it to visited
    this.frontier.delete(this.current);
    this.visited.add(this.current);
    this.current.status = "visited";
    this.addToFrontier(this.current.adjacents);

    // choose random cell from frontier
    const iteratable = [...this.frontier.values()];
    const randomIndex = Math.floor(Math.random() * iteratable.length);
    const frontierCell = iteratable[randomIndex];

    // open wall between frontier cell and choose its connection
    if (frontierCell) {
      const randomConn = Math.floor(
        Math.random() * frontierCell.connections.length
      );
      const connectionCell = frontierCell.connections[randomConn];
      if (frontierCell.x === connectionCell.x) {
        if (frontierCell.y > connectionCell.y) {
          frontierCell.topWall = false;
          connectionCell.bottomWall = false;
        } else {
          frontierCell.bottomWall = false;
          connectionCell.topWall = false;
        }
      } else {
        if (frontierCell.x > connectionCell.x) {
          frontierCell.leftWall = false;
          connectionCell.rightWall = false;
        } else {
          frontierCell.rightWall = false;
          connectionCell.leftWall = false;
        }
      }
    }

    // make the frontier cell the new current
    this.current = frontierCell;

    // while there are still unvisited cells, repeat
    if (this.frontier.size > 0) {
      this.recursiveSpanningTree();
    }
  }

  //add unvisited adjacent cells to frontier
  protected addToFrontier(adjacentCells: Cell[]): void {
    for (const adjacentCell of adjacentCells) {
      if (adjacentCell.status === "unvisited") {
        // unvisited.delete(c);
        this.frontier.add(adjacentCell);
        adjacentCell.status = "frontier";
        //make current cell the frontier cell's connection
        adjacentCell.connections.push(this.current);
      } else if (adjacentCell.status === "frontier") {
        adjacentCell.connections.push(this.current);
      }
    }
  }
}

class Cell {
  public x: number;
  public y: number;
  public topWall: boolean;
  public bottomWall: boolean;
  public leftWall: boolean;
  public rightWall: boolean;
  public index: number[];
  public status: string;
  public adjacents: Array<Cell>;
  public connections: Array<Cell>;
}
