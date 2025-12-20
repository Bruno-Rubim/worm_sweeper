import type Shop from "./shop.js";

export default class Level {
  depth: number;
  difficulty: number;
  shop: Shop | undefined;
  constructor(args: { depth: number; difficulty: number; shop?: Shop }) {
    this.depth = args.depth;
    this.difficulty = args.difficulty;
    this.shop = args.shop;
  }
}
