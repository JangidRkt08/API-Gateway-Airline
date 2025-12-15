// Basic Server configuraitopn
const express = require('express')
const {ServerConfig,logger} = require('./config')
const rateLimit = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");
const apiRoutes = require("./routes");
const app = express();

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 3, // Limit each IP to 3 requests per `window` (2 minutes)
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

app.use(
  "/flightsService",
  createProxyMiddleware({
    target: ServerConfig.FLIGHT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/flightsService`]: "/",
    },
  })
);
app.use(
  "/bookingService",
  createProxyMiddleware({
    target: ServerConfig.BOOKING_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/flightsService`]: "/",
    },
  })
);
app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log("server started at port 5000");
});

/*** 
 * user
 * |
 * v
 * localhost://5000  (API_GATEWAY) -> * localhost://3000/api/v1/booking (Booking Service)
 * |                      |
 * |                      v
 * |                     Proxy ->   * localhost://5000/bookingService/api/v1/booking (booking Service using proxy)
 * v
 * localhost://3000/api/v1/flights (Flight Service)
 *  |
 *  v
 *  Proxy -> localhost://5000/flightsService/api/v1/flight  (flight Service using proxy)
 * 
 * 
*/