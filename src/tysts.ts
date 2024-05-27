import { FromCoercer, coercer } from ".";

//#region Core
{
  interface User {
    name: string;
    email: string;
    age?: number;
  }

  interface Project {
    slug: string;
    name: string;
  }

  //! It allows to specify the shape
  {
    const coerceUser = coercer<User>(($) => ({
      name: String,
      email: String,
      age: $.Optional(Number),
    }));

    //! Forces to return correct coercer

    //! Age must be optional
    // @ts-expect-error
    coercer<User>(($) => ({
      name: String,
      email: String,
      age: Number,
    }));

    //! Email is missing
    // @ts-expect-error
    coercer<User>(($) => ({
      name: String,
      age: $.Optional(Number),
    }));

    //! It returns coerced data
    const user = coerceUser(null);
    user satisfies User;
    user.name;

    //! It allows to pass schema directly

    const coerceProject = coercer<Project>({
      slug: String,
      name: String,
    });

    const project = coerceProject(null);
    project satisfies Project;
    project.name;
  }

  //! It allows to infer schema
  {
    const coerceUser = coercer.infer(($) => ({
      name: String,
      email: String,
      age: $.Optional(Number),
    }));

    type UserSchema = FromCoercer<typeof coerceUser>;
    type _a = Assert<User, UserSchema>;
    type _b = Assert<UserSchema, User>;

    //! It returns coerced data
    const user = coerceUser(null);
    user satisfies User;
    user.name;

    //! It allows to pass schema directly

    const coerceProject = coercer.infer({
      slug: String,
      name: String,
    });

    const project = coerceProject(null);
    project satisfies Project;
    project.name;
  }

  //! It allows to coerce FormData
  {
    const formCoercer = coercer.infer(($) => ({
      email: String,
      password: String,
    }));

    formCoercer(new FormData());
  }
}
//#endregion

//#region Nested
{
  {
    interface Name {
      first: string;
      last: string;
    }

    interface User {
      name: Name;
      email: string;
    }

    //! It coerces nested objects

    {
      const coerceUser = coercer<User>(($) => ({
        name: {
          first: String,
          last: String,
        },
        email: String,
      }));

      const user = coerceUser(null);

      //! It returns coerced data
      user satisfies User;
      user.name.first;
    }

    {
      const coerceUser = coercer.infer(($) => ({
        name: {
          first: String,
          last: String,
        },
        email: String,
      }));

      const user = coerceUser(null);

      //! It works with inferred schema
      user satisfies User;
      user.name.first;

      //! If allows to infer schema
      type UserSchema = FromCoercer<typeof coerceUser>;
      type _a = Assert<User, UserSchema>;
      type _b = Assert<UserSchema, User>;
    }
  }

  {
    interface Lyrics {
      author?: string;
      lines: string[];
    }

    interface Song {
      title: string;
      lyrics: Lyrics;
      artist: string;
    }

    {
      const coerceSong = coercer<Song>(($) => ({
        title: String,
        artist: String,
        lyrics: {
          author: $.Optional(String),
          lines: Array(String),
        },
      }));

      const song = coerceSong(null);

      //! It coerces arrays
      song satisfies Song;
      song.title;
      const line = song.lyrics.lines[0];
      if (line) {
        line satisfies string;
        line.length;
      }
    }

    {
      const coerceSong = coercer.infer(($) => ({
        title: String,
        artist: String,
        lyrics: {
          author: $.Optional(String),
          lines: Array(String),
        },
      }));

      const song = coerceSong(null);

      //! It works with inferred schema
      song satisfies Song;
      song.title;
      const line = song.lyrics.lines[0];
      if (line) {
        line satisfies string;
        line.length;
      }

      //! If allows to infer schema
      type SongSchema = FromCoercer<typeof coerceSong>;
      type _a = Assert<Song, SongSchema>;
      type _b = Assert<SongSchema, Song>;
    }
  }
}
//#endregion

//#region Unions
{
  type Credentials = EmailCredentials | PhoneCredentials;

  interface EmailCredentials {
    email: string;
    password: string;
  }

  interface PhoneCredentials {
    phone: string;
  }

  interface User {
    name: string;
    credentials: Credentials;
  }

  //! It allows to specify a shape with an union
  {
    const coerceUser = coercer<User>(($) => ({
      name: String,
      credentials: $.Union(
        {
          email: String,
          password: String,
        },
        {
          phone: String,
        }
      ),
    }));

    //! It returns coerced data
    const user = coerceUser(null);
    user.credentials satisfies Credentials;
    if ("email" in user.credentials) user.credentials.password;
  }

  //! It allows to infer schema
  {
    const coerceUser = coercer.infer(($) => ({
      name: String,
      credentials: $.Union(
        {
          email: String,
          password: String,
        },
        {
          phone: String,
        }
      ),
    }));

    type UserSchema = FromCoercer<typeof coerceUser>;
    type _a = Assert<User, UserSchema>;
    type _b = Assert<UserSchema, User>;

    //! It returns coerced data
    const user = coerceUser(null);
    user.credentials satisfies Credentials;
    if ("email" in user.credentials) user.credentials.password;
  }
}
//#endregion

//#region Primitives
{
  interface Mixed {
    type: "hello";
    flag: true;
    nope: null;
    nah: undefined;
  }

  //! It supports primitives

  {
    const coerceMixed = coercer<Mixed>(($) => ({
      type: "hello",
      flag: true,
      nope: null,
      nah: undefined,
    }));

    const mixed = coerceMixed(null);

    //! It returns coerced data
    mixed satisfies Mixed;
    mixed.type;
  }

  {
    const coerceMixed = coercer.infer(($) => ({
      type: "hello" as const,
      flag: true as const,
      nope: null,
      nah: undefined,
    }));

    const mixed = coerceMixed(null);

    //! It works with inferred schema
    mixed satisfies Mixed;
    mixed.type;

    //! If allows to infer schema
    type MixedSchema = FromCoercer<typeof coerceMixed>;
    type _a = Assert<Mixed, MixedSchema>;
    type _b = Assert<MixedSchema, Mixed>;
  }
}
//#endregion

//#region Docs
{
  const data = null as unknown;

  {
    interface User {
      name: string;
      email: string;
      age?: number;
    }

    const coerceUser = coercer<User>(($) => ({
      name: String,
      email: String,
      age: $.Optional(Number),
    }));
  }

  {
    const coerceUser = coercer.infer(($) => ({
      name: String,
      email: String,
      age: $.Optional(Number),
    }));

    const user = coerceUser(data);
    //=> { user: "Sasha", email: "" }
  }
}
//#endregion

type Assert<Type1, _Type2 extends Type1> = true;
