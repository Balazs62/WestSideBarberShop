import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle, ExternalLink, ChevronLeft, ChevronRight, Scissors } from "lucide-react";
import { base44 } from "@/api/base44Client";

const FALLBACK_SERVICES = [
  "Átmenetes hajvágás – 5 500 Ft",
  "Haj + szakáll vágás – 7 500 Ft",
  "Hajvágás egyhosszra + szakáll",
  "Szakállvágás, átmenet + kontúrozás",
  "Gyerek hajvágás (9 éves korig)",
  "Hajvágás egyhosszra",
  "Hajvágás – Béci – 6 000 Ft",
  "Prémium hajvágás – Béci – 7 500 Ft",
  "Hajvágás + szakáll – Béci – 8 000 Ft",
  "Prémium haj + szakáll – Béci – 10 000 Ft",
  "Haj + szakáll + festés – Béci – 10 000 Ft",
  "Exkluzív csomag – Béci – 25 000 Ft",
];

const BARBERS = ["Tamás", "Béci"];

const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

export default function BookingSection({ preselectedService }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serviceOptions, setServiceOptions] = useState(FALLBACK_SERVICES);
  const [form, setForm] = useState({
    service: "",
    barber: "",
    date: "",
    time: "",
    client_name: "",
    phone: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    base44.entities.Service.filter({ active: true }, "sort_order", 100)
      .then((data) => {
        if (data.length) {
          setServiceOptions(data.map(s => s.price ? `${s.name} – ${s.price}` : s.name));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (preselectedService) {
      setForm(f => ({ ...f, service: preselectedService }));
      setStep(1);
    }
  }, [preselectedService]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const canNext = () => {
    if (step === 1) return form.service && form.barber;
    if (step === 2) return form.date && form.time;
    if (step === 3) return form.client_name && form.phone;
    return false;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await base44.entities.Booking.create({
        service: form.service,
        barber: form.barber,
        date: form.date,
        time: form.time,
        client_name: form.client_name,
        phone: form.phone,
        email: form.email,
        notes: form.notes,
        status: "pending",
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setStep(1);
    setForm({ service: "", barber: "", date: "", time: "", client_name: "", phone: "", email: "", notes: "" });
  };

  const today = new Date().toISOString().split("T")[0];

  const stepLabels = ["Szolgáltatás", "Dátum & Idő", "Adatok"];

  if (submitted) {
    return (
      <section id="booking" className="py-20 sm:py-28 bg-secondary/30">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Köszönjük a foglalásod!</h2>
            <p className="font-body text-muted-foreground mb-3">
              Hamarosan visszaigazoljuk az időpontot.
            </p>
            <p className="font-body text-sm text-muted-foreground mb-8">
              Kérdés esetén hívj minket:{" "}
              <a href="tel:+36303885043" className="text-primary hover:underline">+36 30 388 5043</a>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={resetForm} className="px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-wide rounded-sm hover:bg-primary/90 transition-colors">
                Új foglalás
              </button>
              <a
                href="https://pozsonyi-tamas-e-v.reservio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-muted-foreground font-body text-sm rounded-sm hover:text-primary hover:border-primary/30 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Reservio
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 sm:py-28 bg-secondary/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-primary/40" />
            <Scissors className="w-4 h-4 text-primary" />
            <div className="h-px w-10 bg-primary/40" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Online foglalás
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Foglalj időpontot néhány kattintással, vagy használd a Reservio rendszerünket.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-semibold transition-all duration-300 ${step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                <span className="hidden sm:block text-xs font-body text-muted-foreground">{stepLabels[s - 1]}</span>
              </div>
              {s < 3 && (
                <div className={`w-10 sm:w-16 h-px mb-4 transition-colors duration-300 ${step > s ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <motion.div
          className="bg-card border border-border rounded-sm p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-2 block">Szolgáltatás kiválasztása *</label>
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
                    {serviceOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => update("service", s)}
                        className={`text-left px-4 py-3 border rounded-sm font-body text-sm transition-all duration-200 ${
                          form.service === s
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-2 block">Barber kiválasztása *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {BARBERS.map((b) => (
                      <button
                        key={b}
                        onClick={() => update("barber", b)}
                        className={`px-4 py-4 border rounded-sm font-body font-medium text-sm transition-all duration-200 ${
                          form.barber === b
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        <User className="w-5 h-5 mx-auto mb-2 opacity-60" />
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Dátum *
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={(e) => update("date", e.target.value)}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-sm font-body text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Időpont *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t}
                        onClick={() => update("time", t)}
                        className={`px-3 py-2.5 border rounded-sm font-body text-sm transition-all duration-200 ${
                          form.time === t
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                {[
                  { key: "client_name", label: "Teljes neved *", IconComp: User, type: "text", placeholder: "Pl. Kiss János" },
                  { key: "phone", label: "Telefonszám *", IconComp: Phone, type: "tel", placeholder: "+36 30 123 4567" },
                  { key: "email", label: "E-mail cím", IconComp: Mail, type: "email", placeholder: "email@pelda.hu" },
                ].map(({ key, label, IconComp, type, placeholder }) => (
                  <div key={key}>
                    <label className="font-body text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <IconComp className="w-4 h-4" /> {label}
                    </label>
                    <input
                      type={type}
                      value={form[key]}
                      onChange={(e) => update(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                ))}
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Megjegyzés (opcionális)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    rows={3}
                    placeholder="Bármilyen kérés vagy megjegyzés..."
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors resize-none"
                  />
                </div>
                {/* Summary */}
                <div className="p-4 bg-secondary/50 border border-border rounded-sm text-sm font-body space-y-1">
                  <p className="text-muted-foreground font-semibold mb-2 text-xs uppercase tracking-wide">Összefoglaló</p>
                  <p><span className="text-muted-foreground">Szolgáltatás:</span> <span className="text-foreground">{form.service}</span></p>
                  <p><span className="text-muted-foreground">Barber:</span> <span className="text-foreground">{form.barber}</span></p>
                  <p><span className="text-muted-foreground">Időpont:</span> <span className="text-foreground">{form.date} {form.time}</span></p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="flex items-center gap-1 text-sm font-body text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Vissza
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
                className="flex items-center gap-1 px-6 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-wide rounded-sm hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Tovább <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canNext() || submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-wide rounded-sm hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Foglalás elküldése
              </button>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-8 text-center">
          <p className="font-body text-sm text-muted-foreground mb-3">
            Vagy foglalj közvetlenül a Reservio rendszerünkön keresztül:
          </p>
          <a
            href="https://pozsonyi-tamas-e-v.reservio.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-primary/30 text-primary font-body font-medium text-sm tracking-wide uppercase rounded-sm hover:bg-primary/10 transition-all duration-300"
          >
            <ExternalLink className="w-4 h-4" />
            Foglalás a Reservio-n
          </a>
        </motion.div>
      </div>
    </section>
  );
}