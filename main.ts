import { PrismaClient } from "./generated/client/deno/edge.ts";
import { Application, Context, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { config } from "https://deno.land/std@0.165.0/dotenv/mod.ts"

const env = await config();
const prisma = new PrismaClient({
	datasources: {
		db: {
			url: env.DATABASE_URL
		}
	}
});

const app = new Application();
const router = new Router();

router
	.get("/api", (context) => { context.response.body = "Welcome to the Dino API!"})
	.get("/api/dino", async (context) => {
		const dinos = await prisma.dino.findMany();
		context.response.body = dinos;
	})
	.get("/api/dino/:id", async (context) => {
		const { id } = context.params;
		const dino = await prisma.dino.findUnique({
			where: {
				id: Number(id)
			}
		});
		context.response.body = dino;
	})
	.post("/api/dino", async (context) => {
		const { name , desc } = context.request.body("json").value;
		const result = await prisma.dino.create({
			data: {
				name,
				desc
			}
		})
		context.response.body = result;
	})
	.delete("/api/dino/:id", async (context) => {
		const { id } = context.params;
		const dino = await prisma.dino.delete({
			where: {
				id: Number(id)
			}
		})
		context.response.body = dino;
	})

app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8000 })


