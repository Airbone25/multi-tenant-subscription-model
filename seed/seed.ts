import {prisma} from "../lib/prisma"

async function main(){
    try{
        const allPlans = await prisma.plan.createManyAndReturn({
            data: [
                {name: "Free",requestLimit: 1000,rateLimit: 10,maxApiKeys: 1},
                {name: "Pro",requestLimit: 100000,rateLimit: 100,maxApiKeys: 5}
            ]
        })

        return allPlans
    }catch(error: any){
        console.log(error.message)
    }
}

main()