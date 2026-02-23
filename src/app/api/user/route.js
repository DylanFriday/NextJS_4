import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";


export async function OPTIONS(req) {
    return new Response(null, {
        status: 200,
        headers: corsHeaders,
    });
}

export async function GET() {
    try {
        const client = await getClientPromise();
        const db = client.db("wad-01");
        const result = await db.collection("user").find({}).toArray();
        console.log("==> result", result);
        return NextResponse.json(result, {
            headers: corsHeaders
        });
    }
    catch (exception) {
        console.error("[api/user][GET] exception:", exception);
        if (exception?.message === "Database connection failed") {
            return NextResponse.json({
                message: "Database unavailable"
            }, {
                status: 500,
                headers: corsHeaders
            })
        }

        const errorMsg = exception.toString();
        return NextResponse.json({
            message: errorMsg
        }, {
            status: 400,
            headers: corsHeaders
        })
    }
}

export async function POST(req) {
    const data = await req.json();
    const username = data.username;
    const email = data.email;
    const password = data.password;
    const firstname = data.firstname;
    const lastname = data.lastname;
    if (!username || !email || !password) {
        return NextResponse.json({
            message: "Missing mandatory data"
        }, {
            status: 400,
            headers: corsHeaders
        })
    }
    try {
        const client = await getClientPromise();
        const db = client.db("wad-01");
        const result = await db.collection("user").insertOne({
            username: username,
            email: email,
            password: await bcrypt.hash(password, 10),
            firstname: firstname,
            lastname: lastname,
            status: "ACTIVE"
        });
        console.log("result", result);
        return NextResponse.json({
            id: result.insertedId
        }, {
            status: 200,
            headers: corsHeaders
        });
    }
    catch (exception) {
        console.error("[api/user][POST] exception:", exception);
        if (exception?.message === "Database connection failed") {
            return NextResponse.json({
                message: "Database unavailable"
            }, {
                status: 500,
                headers: corsHeaders
            })
        }

        const errorMsg = exception.toString();
        let displayErrorMsg = "";
        if (errorMsg.includes("duplicate")) {
            if (errorMsg.includes("username")) {
                displayErrorMsg = "Duplicate Username!!"
            }
            else if (errorMsg.includes("email")) {
                displayErrorMsg = "Duplicate Email!!"
            }
        }
        return NextResponse.json({
            message: displayErrorMsg
        }, {
            status: 400,
            headers: corsHeaders
        })
    }
}
