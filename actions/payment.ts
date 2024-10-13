"use server";

import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function payment(
  totalPrice: number,
  appointmentData: {
    userName: string;
    userEmail: string;
    date: string;
    time: string;
    services: { name: string; price: number }[];
  }
) {
  const items = appointmentData.services.map((service) => ({
    id: service.name,
    title: service.name,
    quantity: 1,
    unit_price: service.price,
  }));

  //  items.push({
  //   id: "total",
  //   title: "Total de servicios",
  //   quantity: 1,
  //   unit_price: totalPrice,
  // });

  const preference = await new Preference(client).create({
    body: {
      items,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/notification`,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/mis-turnos`,
      },
      auto_return: "approved",
    },
  });

  console.log("esto FIAMMA:", preference.notification_url);
  return {
    redirectUrl: preference.sandbox_init_point!,
    appointmentData: {
      userName: appointmentData.userName,
      userEmail: appointmentData.userEmail,
      date: appointmentData.date,
      time: appointmentData.time,
      services: appointmentData.services.map((service) => service.name), // Asegúrate de que esto sea un array de nombres
    },
  };
}
