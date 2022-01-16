using Plots

x = 0:0.01:2pi

# plot(x, f)

g(x) = cos(x)
# Plot{Plots.GRBackend() n=2}
plot!(x, g)