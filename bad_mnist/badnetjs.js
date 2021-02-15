
function convInference(X, layer)
{    
    var H = new Float32Array(layer.output_width * layer.output_height * layer.output_depth);
    const inputPlaneSize = layer.input_width * layer.input_height;

    let ix = 0;
    for (let d = 0; d < layer.output_depth; ++d)
    {
        let kernelStartIx = layer.kernel_size*layer.kernel_size*layer.input_depth*d;
        for (let j = 0; j < layer.output_height; ++j)
        {
            for (let i = 0; i < layer.output_width; ++i, ++ix)
            {

                let sum = 0;
                let kernelIx = kernelStartIx;

                for (let dd = 0; dd < layer.input_depth; ++dd)
                {
                    for (let jj = 0; jj < layer.kernel_size; ++jj)
                    {
                        for (let ii = 0; ii < layer.kernel_size; ++ii, ++kernelIx)
                        {
                            let convY = j + jj - layer.padding;
                            let convX = i + ii - layer.padding;
                            if (convX >= 0 && convY >= 0 &&
                                convX < layer.input_width && convY < layer.input_height)
                            {
                                sum += X[dd * inputPlaneSize + layer.input_width*convY+convX]*layer.weights[kernelIx]; 
                            }
                        }
                    }
                }

                sum += layer.bias[d];

                if (layer.relu && sum < 0)
                {
                    sum = 0;
                }
                H[ix] = sum;
            }
        }
    }

    return H;
}

function fcInference(X, layer)
{
    var H = new Float32Array(layer.output_width);
    let ix = 0;
    for (let j = 0; j < layer.output_width; ++j)
    {
        let sum = 0;
        for (let i = 0; i < layer.input_width*layer.input_height*layer.input_depth; ++i, ++ix)
        {
            sum += X[i]*layer.weights[ix]; 
        }

        sum += layer.bias[j];

        if (layer.relu && sum < 0) {
            sum = 0;
        }
        H[j] = sum;
    }

    return H;
}

// poor mans four value sort
function get_max(a,b,c,d)
{
    let largest = a;
    if (b > largest) { largest = b; }    
    if (c > largest) { largest = c; }    
    if (d > largest) { largest = d; }
    return largest;   
}

function mpInference(X, layer)
{
    var H = new Float32Array(layer.output_width * layer.output_height * layer.output_depth);

    let outputIx = 0;
    for (let d = 0; d < layer.output_depth; ++d)
    {
        for (let j = 0; j < layer.output_height; ++j)
        {
            for (let i = 0; i < layer.output_width; ++i, ++outputIx)
            {
                let ix = j*2*layer.input_width + i * 2 + layer.input_width * layer.input_height * d;
                let maxVal = get_max(X[ix], X[ix+1], X[ix+layer.input_width], X[ix+layer.input_width+1]);
                H[outputIx] = maxVal;
            }
        }
    }

    return H;
}

function inferenceBadNet(X, badnet)
{
    for (let layer of badnet.layers)
    {
        X = layerInferenceTable[layer.layer_type](X, layer);
    }
    return X;
}

function exp_normalize(X)
{
    var probs = new Float32Array(X.length);

    let sum = 0;
    for (let i = 0; i < X.length; ++i)
    {
        let v = Math.exp(X[i]);
        sum += v;
        probs[i] = v;
    }
    for (let i = 0; i < X.length; ++i)
    {
        probs[i] /= sum;
    }
    return probs;
    
}


var layerInferenceTable = {}
layerInferenceTable["convolution_layer"] = convInference;
layerInferenceTable["fc_layer"] = fcInference;
layerInferenceTable["max_pool_layer"] = mpInference;
