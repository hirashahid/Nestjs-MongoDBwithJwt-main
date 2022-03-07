import { Module, MiddlewareConsumer, NestModule, } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerMiddleware } from '../services/logger.middleware';

import { ProductSchema } from "./product.model";
import { ProductsController } from "./products.controller";
import { ProductServices } from "./products.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }])],
    controllers: [ProductsController],
    providers: [ProductServices],
})

export class ProductsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes('products/*');
    }
}
