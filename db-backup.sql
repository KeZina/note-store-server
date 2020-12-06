CREATE TABLE public.profile (
    name character varying(40) NOT NULL,
    password character varying(500),
    token character varying(500)
);

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (name);

CREATE TABLE public.note (
    owner character varying(40),
    content character varying(1000),
    created timestamp without time zone,
    updated timestamp without time zone,
    title character varying(40),
    id SERIAL
);

ALTER TABLE ONLY public.note
    ADD CONSTRAINT note_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.note
    ADD CONSTRAINT note_fkey FOREIGN KEY (owner) REFERENCES public.profile(name) ON UPDATE CASCADE ON DELETE CASCADE;