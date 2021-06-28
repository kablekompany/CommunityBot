module.exports = {
  addRm: (ctx, user, prefix, command, cooldown) =>
    ctx.m.collection('rms').insertOne({
      _id: 2,
      prefix,
      command,
      cooldown,
      user,
    }),
  getPrefixes: (ctx, user) => ctx.m.collection('rms').find({ user }).toArray(),
};
