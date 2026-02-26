import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Clock, MessageCircle, Send } from "lucide-react";
import styles from "./ContactoPage.module.css";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { COPY, CONTACT, WHATSAPP_URL } from "@/config/site";

export const ContactoPage = () => {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [sent, setSent] = useState(false);

  const handleWhatsApp = () => {
    const msg = `Hola! Me contacto desde la web. Soy ${form.nombre || "un cliente"} y quería consultar: ${form.mensaje || "..."}`;
    window.open(WHATSAPP_URL(msg), "_blank");
    setSent(true);
  };

  return (
    <main className={styles.page}>
      {/* Header */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p className={styles.eyebrow} variants={fadeInUp}>
            {COPY.contacto.eyebrow}
          </motion.p>
          <motion.h1 className={styles.title} variants={fadeInUp}>
            {COPY.contacto.title}
          </motion.h1>
          <motion.p className={styles.subtitle} variants={fadeInUp}>
            {COPY.contacto.subtitle}
          </motion.p>
        </motion.div>
      </section>

      {/* Content */}
      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Info cards */}
            <motion.div
              className={styles.infoColumn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={staggerContainer}
            >
              {[
                {
                  icon: MessageCircle,
                  title: "WhatsApp",
                  lines: [CONTACT.phone, "Lunes a Sábado 9-19h"],
                  action: () => window.open(WHATSAPP_URL(), "_blank"),
                  actionLabel: "Escribir ahora",
                  accent: true,
                },
                {
                  icon: Mail,
                  title: "Email",
                  lines: [CONTACT.email, "Respondemos en 24 horas"],
                  action: () => window.open(`mailto:${CONTACT.email}`),
                  actionLabel: "Enviar email",
                },
                {
                  icon: MapPin,
                  title: "Dirección",
                  lines: [
                    CONTACT.address.split(", ")[0],
                    CONTACT.address.split(", ").slice(1).join(", "),
                  ],
                  action: () =>
                    window.open(
                      `https://maps.google.com/?q=${encodeURIComponent(CONTACT.address)}`,
                    ),
                  actionLabel: "Ver en mapa",
                },
                {
                  icon: Clock,
                  title: "Horarios",
                  lines: [CONTACT.horarios.semana, CONTACT.horarios.sabado],
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  className={`${styles.infoCard} ${item.accent ? styles.infoCardAccent : ""}`}
                  variants={fadeInUp}
                >
                  <div className={styles.infoIcon}>
                    <item.icon size={22} />
                  </div>
                  <div className={styles.infoText}>
                    <h3 className={styles.infoTitle}>{item.title}</h3>
                    {item.lines.map((l) => (
                      <p key={l} className={styles.infoLine}>
                        {l}
                      </p>
                    ))}
                    {item.action && item.actionLabel && (
                      <button
                        className={styles.infoAction}
                        onClick={item.action}
                      >
                        {item.actionLabel} →
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Form */}
            <motion.div
              className={styles.formColumn}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.formCard}>
                <h2 className={styles.formTitle}>{COPY.contacto.formTitle}</h2>
                <p className={styles.formSubtitle}>
                  {COPY.contacto.formSubtitle}
                </p>

                {sent ? (
                  <div className={styles.successBox}>
                    <MessageCircle size={32} />
                    <h3>{COPY.contacto.successTitle}</h3>
                    <p>{COPY.contacto.successDesc}</p>
                    <button
                      className={styles.btnReset}
                      onClick={() => {
                        setForm({ nombre: "", email: "", mensaje: "" });
                        setSent(false);
                      }}
                    >
                      {COPY.contacto.successReset}
                    </button>
                  </div>
                ) : (
                  <form
                    className={styles.form}
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleWhatsApp();
                    }}
                  >
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        {COPY.contacto.fields.nombre}
                      </label>
                      <input
                        className={styles.input}
                        placeholder={COPY.contacto.fields.nombrePlaceholder}
                        value={form.nombre}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, nombre: e.target.value }))
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        {COPY.contacto.fields.email}
                      </label>
                      <input
                        className={styles.input}
                        type="email"
                        placeholder={COPY.contacto.fields.emailPlaceholder}
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        {COPY.contacto.fields.mensaje}
                      </label>
                      <textarea
                        className={styles.textarea}
                        rows={5}
                        placeholder={COPY.contacto.fields.mensajePlaceholder}
                        value={form.mensaje}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, mensaje: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <button type="submit" className={styles.btnSubmit}>
                      <Send size={16} />
                      {COPY.contacto.submit}
                    </button>
                    <p className={styles.formNote}>{COPY.contacto.note}</p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};
