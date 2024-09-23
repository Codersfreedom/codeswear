import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export async function getAnalytics(req, res) {
  try {
    const analyticsData = await getAnalyticsData();

    const endDate = new Date();
    const startDate = new Date(endDate - 7 * 24 * 60 * 60 * 1000);

    const salesData = await getSalesData(startDate, endDate);

    res.json({ analyticsData, salesData });
  } catch (error) {
    console.log("Error in get analytics controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getAnalyticsData() {
  try {
    const totalUser = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const { totalSales, totalRevenue } = salesData[0] || {
      totalSales: 0,
      totalRevenue: 0,
    };

    return {
      users: totalUser,
      products: totalProducts,
      totalSales,
      totalRevenue,
    };
  } catch (error) {
    throw error;
  }
}

async function getSalesData(startDate, endDate) {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dateArray = getDatesInRange(startDate, endDate);

    return dateArray.map((date) => {
      const foundDate = dailySalesData.find((item) => item._id === date);

      return {
        date,
        salesData: foundDate?.sales || 0,
        revenue: foundDate?.revenue || 0,
      };
    });
  } catch (error) {
    throw error;
  }
}

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
