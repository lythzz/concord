import authConfig from '@/auth.config'
import NextAuth from 'next-auth'
import {
  publicRoutes,
  privateRoutes,
  authRoutes,
  apiAuthPrefix,
  defaultLoginRedirect
} from '@/routes'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth

    const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname)
    const isPrivateRoute = privateRoutes.includes(req.nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(req.nextUrl.pathname)
    const isApiRoute = req.nextUrl.pathname.startsWith(apiAuthPrefix)

    

    if(isAuthRoute){
      if(isLoggedIn){
        return Response.redirect(new URL(defaultLoginRedirect, nextUrl))
      }
      return undefined;
    }

    //if(!isPublicRoute && !isLoggedIn){
     // return Response.redirect(new URL('/auth', nextUrl))
   // }
    
    return undefined;
}) 

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    
  ],
}