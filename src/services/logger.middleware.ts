import { Injectable, NestMiddleware } from "@nestjs/common";

import { ProductServices } from "src/products/products.service";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private readonly productsService: ProductServices) { }

    async use(req: Request, res: Response, next: () => void) {
        const { body }: any = req;
        const product = await this.getProduct(body.id);
        req.body['product'] = product
        console.log(req.body);
        next();
    }

    async getProduct(id) {
        return await this.productsService.getSingleProduct(id);
    }

}