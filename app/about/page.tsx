import Link from "next/link"
import { Briefcase, Target, Eye, Shield, Users, Award, TrendingUp, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                            <Briefcase className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">فلكس جوب</span>
                    </Link>
                    <nav className="flex items-center gap-3">
                        <Link href="/auth/login">
                            <Button variant="ghost" size="sm">تسجيل الدخول</Button>
                        </Link>
                        <Link href="/auth/sign-up">
                            <Button size="sm">ابدأ الآن</Button>
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {/* المقدمة */}
                <section className="py-20 bg-muted/30">
                    <div className="mx-auto max-w-4xl px-4 text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6 text-balance">
                            عن منصة <span className="text-primary">FLEX JOBS</span>
                        </h1>
                        <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
                            يشهد سوق العمل في المملكة العربية السعودية تحولاً متسارعاً في ظل النمو الاقتصادي المتوافق مع رؤية 2030.
                            أدى هذا التحول إلى زيادة الطلب على أنماط توظيف مرنة تلبي احتياجات الشباب والمنشآت الصغيرة والمتوسطة.
                            انطلقت فكرة منصة Flex Jobs لسد الفجوة في سوق الوظائف الجزئية واليومية من خلال حل رقمي متخصص.
                        </p>
                    </div>
                </section>

                {/* الرسالة والرؤية */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 grid gap-12 md:grid-cols-2">
                        <div className="rounded-2xl border bg-card p-8 shadow-sm">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Target className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">رسالتنا</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                تمكين الشباب في المملكة العربية السعودية من الوصول إلى فرص عمل مرنة وموثوقة، وتوفير قناة توظيف فعالة للمنشآت الصغيرة والمتوسطة.
                            </p>
                        </div>
                        <div className="rounded-2xl border bg-card p-8 shadow-sm">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Eye className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">رؤيتنا</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                أن تصبح منصة Flex Jobs المرجع الأول للوظائف المرنة داخل المملكة العربية السعودية، مع التوسع لاحقاً إلى الأسواق العربية.
                            </p>
                        </div>
                    </div>
                </section>

                {/* القيم */}
                <section className="py-20 bg-muted/30">
                    <div className="mx-auto max-w-7xl px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">قيمنا الأساسية</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <ValueCard icon={<Shield />} title="الشفافية" description="وضوح الأجور وآليات التقييم لجميع الأطراف." />
                            <ValueCard icon={<Award />} title="العدالة" description="ضمان تكافؤ الفرص لجميع الباحثين عن عمل." />
                            <ValueCard icon={<TrendingUp />} title="الكفاءة" description="تقليل زمن التوظيف وتسهيل العمليات." />
                            <ValueCard icon={<Briefcase />} title="الاحترافية" description="الالتزام بمعايير تشغيل واضحة وعالية الجودة." />
                            <ValueCard icon={<Heart />} title="تمكين الشباب" description="دعم الاستقلال المالي وبناء الخبرة العملية." />
                        </div>
                    </div>
                </section>

                {/* الفريق */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4">
                        <h2 className="text-3xl font-bold text-center mb-4">فريق العمل</h2>
                        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
                            فريق متنوع يجمع بين الكفاءات القيادية، التحليلية، والتقنية لتحقيق أهداف المنصة.
                        </p>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <TeamMember
                                name="مريم الشويكي"
                                role="المؤسس والرئيس التنفيذي (CEO)"
                                disc="نمط D"
                                desc="تتسم بالحسم والتركيز على النتائج واتخاذ القرارات السريعة."
                                imageUrl="/team/maryam_shoueiki_profile_1771965136192.png"
                            />
                            <TeamMember
                                name="عبد الله أبو صغيرة"
                                role="شريك مؤسس ومدير تقني (CTO)"
                                disc="نمط D/C"
                                desc="يجمع بين الحزم والانضباط التحليلي، ويشرف على الجوانب التقنية والتشغيلية."
                                imageUrl="/team/abdullah_abu_saghira_profile_1771965149395.png"
                            />
                            <TeamMember
                                name="علي العلي"
                                role="مدير تطوير الأعمال"
                                disc="نمط D/I"
                                desc="يجمع بين الحزم والتأثير، ويتمتع بمهارات تفاوض وبناء علاقات استراتيجية."
                                imageUrl="/team/ali_al_ali_profile_1771965162839.png"
                            />
                            <TeamMember
                                name="حور أحمد"
                                role="مدير العمليات"
                                disc="نمط S"
                                desc="تركز على الانسجام الداخلي وتنظيم العمليات اليومية لضمان الاستقرار."
                                imageUrl="/team/hour_ahmed_profile_1771965180365.png"
                            />
                            <TeamMember
                                name="بشاير البلاوي"
                                role="المستشار المالي والقانوني"
                                disc="نمط C"
                                desc="تحليلية ودقيقة، تهتم بالتفاصيل المالية والقانونية وتقليل المخاطر."
                                imageUrl="https://api.dicebear.com/7.x/avataaars/svg?seed=Bashayer6"
                            />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t py-12">
                <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
                    <div className="mb-4 flex justify-center gap-6">
                        <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
                        <Link href="/about" className="hover:text-primary transition-colors font-bold text-foreground">عن المنصة</Link>
                    </div>
                    {'فلكس جوب \u00A9'} {new Date().getFullYear()}. جميع الحقوق محفوظة.
                </div>
            </footer>
        </div>
    )
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-6 rounded-xl border bg-card">
            <div className="mb-3 text-primary">{icon}</div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    )
}

function TeamMember({ name, role, disc, desc, imageUrl }: { name: string, role: string, disc: string, desc: string, imageUrl?: string }) {
    return (
        <div className="p-6 rounded-2xl border bg-card text-right overflow-hidden flex flex-col">
            {imageUrl && (
                <div className="relative h-64 w-full mb-6 rounded-xl overflow-hidden group">
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white text-sm font-medium">{name}</span>
                    </div>
                </div>
            )}
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 w-fit mr-0 ml-auto">
                {disc}
            </div>
            <h3 className="text-xl font-bold mb-1">{name}</h3>
            <p className="text-primary text-sm font-medium mb-4">{role}</p>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">{desc}</p>
        </div>
    )
}
